import { useEffect, useState, useCallback } from "react";
import {
  useBankAccounts,
  usePrimaryBankAccount,
  type BankAccount,
} from "./useBankAccounts";
import {
  CreateTransactionData,
  Transaction,
  useCreateTransaction,
  useDeleteTransaction,
  useUpdateTransaction,
  useTransaction as useTransactionDetail,
} from "./useTransactionOperations";
import { useAuth } from "./useAuth";
import {
  transactionsService,
  type TransactionUpdate,
  type ConnectionState,
} from "../services/reactive/transactions.service";

// Re-export tipos
export type { TransactionCategory } from "../lib/transactions";

// Interface do hook principal - combinando responsabilidades relacionadas
export interface UseTransactionsReturn {
  // Dados de transações (agora sempre array, nunca undefined)
  transactions: Transaction[];
  isLoadingTransactions: boolean;
  transactionsError: Error | null;

  // Dados de contas bancárias
  bankAccounts: BankAccount[] | undefined;
  primaryAccount: BankAccount | null | undefined;
  isLoadingAccounts: boolean;
  accountsError: Error | null;

  // Estados de criação
  isCreating: boolean;
  createTransactionError: Error | null;

  // Estados de edição
  isUpdating: boolean;
  updateTransactionError: Error | null;

  // Estados de exclusão
  isDeleting: boolean;
  deleteTransactionError: Error | null;

  // Estado da conexão real-time
  isConnected: boolean;
  lastUpdate: TransactionUpdate | null;
  connectionState: ConnectionState;

  // Ações
  createTransaction: (data: CreateTransactionData) => Promise<Transaction>;
  updateTransaction: (
    transactionId: string,
    data: Partial<CreateTransactionData>
  ) => Promise<Transaction>;
  deleteTransaction: (transactionId: string) => Promise<void>;
  refreshTransactions: () => Promise<void>;
  refreshBankAccounts: () => void;

  // Função helper para transação específica
  getTransaction: (id: string) => {
    transaction: Transaction | undefined;
    isLoading: boolean;
    error: Error | null;
  };
}

/**
 * Hook principal que combina todas as funcionalidades relacionadas a transações
 * Agora usa sistema realtime para sincronização automática
 *
 * Funcionalidades:
 * - Conecta automaticamente ao serviço de transações quando usuário está disponível
 * - Desconecta automaticamente ao desmontar o componente
 * - Fornece loading state durante a inicialização
 * - Gerencia erros de conexão
 * - Permite refresh manual das transações
 * - Recebe atualizações em tempo real (INSERT, UPDATE, DELETE)
 * - Gerencia contas bancárias
 * - Operações de CRUD de transações
 */
export function useTransactions(): UseTransactionsReturn {
  const { user } = useAuth();
  const { isLoading: isLoadingAccount } = usePrimaryBankAccount();

  // Estado local para transações realtime
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<TransactionUpdate | null>(null);
  const [connectionState, setConnectionState] = useState<ConnectionState>(
    transactionsService.getConnectionState()
  );

  // Hooks especializados para contas bancárias
  const {
    data: bankAccounts,
    isLoading: isLoadingAccounts,
    error: accountsError,
    refetch: refreshBankAccounts,
  } = useBankAccounts();

  const { data: primaryAccount } = usePrimaryBankAccount();

  /**
   * Função para atualizar as transações manualmente
   */
  const refreshTransactions = useCallback(async () => {
    if (!user?.id) {
      console.warn(
        "⚠️ [useTransactions] Tentativa de refresh sem usuário disponível"
      );
      return;
    }

    try {
      await transactionsService.refreshTransactions(user.id);
    } catch (error) {
      console.error("❌ [useTransactions] Erro ao fazer refresh:", error);
    }
  }, [user?.id]);

  // Efeito principal: gerencia o ciclo de vida do stream realtime
  useEffect(() => {
    // Se ainda está carregando a conta ou não há usuário, não faz nada
    if (isLoadingAccount || !user?.id) {
      console.log("⏳ [useTransactions] Aguardando usuário...", {
        isLoadingAccount,
        hasUser: !!user?.id,
      });
      return;
    }

    console.log("🎯 [useTransactions] Iniciando monitoramento", {
      userId: user.id,
    });

    let isSubscribed = true;

    // Iniciar o stream
    const startStream = async () => {
      try {
        setIsLoadingTransactions(true);
        await transactionsService.startTransactionsStream(user.id);

        if (isSubscribed) {
          setIsLoadingTransactions(false);
        }
      } catch (error) {
        console.error("❌ [useTransactions] Erro ao iniciar stream:", error);
        if (isSubscribed) {
          setIsLoadingTransactions(false);
        }
      }
    };

    startStream();

    // Subscrever ao Observable de transações
    const transactionsSubscription =
      transactionsService.transactions$.subscribe({
        next: (newTransactions) => {
          if (isSubscribed) {
            console.log(
              "💰 [useTransactions] Transações atualizadas:",
              newTransactions.length
            );
            setTransactions(newTransactions);
          }
        },
        error: (err) => {
          console.error(
            "❌ [useTransactions] Erro no stream de transações:",
            err
          );
        },
      });

    // Subscrever às atualizações individuais (com metadados)
    const updatesSubscription =
      transactionsService.transactionUpdates$.subscribe({
        next: (update) => {
          if (isSubscribed) {
            console.log(
              "📊 [useTransactions] Atualização recebida:",
              update.eventType,
              update.transaction.id
            );
            setLastUpdate(update);
          }
        },
      });

    // Subscrever ao estado da conexão
    const connectionSubscription =
      transactionsService.connectionState$.subscribe({
        next: (state) => {
          if (isSubscribed) {
            console.log("🔌 [useTransactions] Estado da conexão:", state);
            setConnectionState(state);
          }
        },
      });

    // Cleanup: desinscrever dos Observables
    return () => {
      console.log("🧹 [useTransactions] Limpando recursos...");
      isSubscribed = false;

      transactionsSubscription.unsubscribe();
      updatesSubscription.unsubscribe();
      connectionSubscription.unsubscribe();
    };
  }, [user?.id, isLoadingAccount]);

  // Hook de criação de transação
  const {
    mutateAsync: createTransactionMutation,
    isPending: isCreating,
    error: createTransactionError,
  } = useCreateTransaction();

  // Hook de atualização de transação
  const {
    mutateAsync: updateTransactionMutation,
    isPending: isUpdating,
    error: updateTransactionError,
  } = useUpdateTransaction();

  // Hook de exclusão de transação
  const {
    mutateAsync: deleteTransactionMutation,
    isPending: isDeleting,
    error: deleteTransactionError,
  } = useDeleteTransaction();

  // Função para atualizar uma transação específica
  const updateTransaction = async (
    transactionId: string,
    data: Partial<CreateTransactionData>
  ) => {
    return await updateTransactionMutation({ transactionId, data });
  };

  // Função para excluir uma transação específica
  const deleteTransaction = async (transactionId: string) => {
    return await deleteTransactionMutation(transactionId);
  };

  // Função helper para obter transação específica usando cache inteligente
  const getTransaction = (id: string) => {
    // Primeiro verifica se a transação já está na lista em cache
    const cachedTransaction = transactions?.find(
      (t: Transaction) => t.id === id
    );

    if (cachedTransaction) {
      return {
        transaction: cachedTransaction,
        isLoading: false,
        error: null,
      };
    }

    // Se não estiver no cache, usa o hook específico
    const { data: transaction, isLoading, error } = useTransactionDetail(id);

    return {
      transaction,
      isLoading,
      error: error as Error | null,
    };
  };

  return {
    // Dados de transações
    transactions: transactions || [],
    isLoadingTransactions: isLoadingAccount || isLoadingTransactions,
    transactionsError: connectionState.error,

    // Dados de contas bancárias
    bankAccounts,
    primaryAccount,
    isLoadingAccounts,
    accountsError: accountsError as Error | null,

    // Estados de criação
    isCreating,
    createTransactionError: createTransactionError as Error | null,

    // Estados de edição
    isUpdating,
    updateTransactionError: updateTransactionError as Error | null,

    // Estados de exclusão
    isDeleting,
    deleteTransactionError: deleteTransactionError as Error | null,

    // Estado da conexão real-time
    isConnected: connectionState.isConnected,
    lastUpdate,
    connectionState,

    // Ações
    createTransaction: createTransactionMutation,
    updateTransaction,
    deleteTransaction,
    refreshTransactions,
    refreshBankAccounts,

    // Helper
    getTransaction,
  };
}

// Hook específico para uma transação - agora usa o hook especializado
export function useTransaction(id: string) {
  return useTransactionDetail(id);
}

/**
 * Hook simplificado que retorna apenas as transações
 * Útil quando você não precisa das informações extras
 */
export function useTransactionsList(): Transaction[] {
  const { transactions } = useTransactions();
  return transactions;
}

/**
 * Hook que retorna apenas novas transações (INSERT)
 */
export function useNewTransactions(
  callback?: (transaction: Transaction) => void
) {
  const { lastUpdate } = useTransactions();

  useEffect(() => {
    if (lastUpdate?.eventType === "INSERT" && callback) {
      callback(lastUpdate.transaction);
    }
  }, [lastUpdate, callback]);

  return lastUpdate?.eventType === "INSERT" ? lastUpdate.transaction : null;
}

/**
 * Hook que filtra transações por tipo
 */
export function useTransactionsByType(
  type: Transaction["transaction_type"]
): Transaction[] {
  const { transactions } = useTransactions();
  return transactions.filter((t) => t.transaction_type === type);
}

/**
 * Hook que filtra transações por status
 */
export function useTransactionsByStatus(
  status: Transaction["status"]
): Transaction[] {
  const { transactions } = useTransactions();
  return transactions.filter((t) => t.status === status);
}

/**
 * Hook que retorna o status da conexão
 */
export function useTransactionConnectionStatus(): {
  isConnected: boolean;
  error: Error | null;
} {
  const { isConnected, transactionsError } = useTransactions();
  return { isConnected, error: transactionsError };
}

// Exports de tipos para compatibilidade
export type {
  Transaction,
  CreateTransactionData,
  BankAccount,
  TransactionUpdate,
  ConnectionState,
};
