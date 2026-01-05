import { useEffect, useState, useCallback } from "react";

import { useAuth } from "./useAuth";
import { usePrimaryBankAccount } from "./useBankAccounts";
import {
  balanceService,
  type BalanceUpdate,
  type ConnectionState,
} from "../services/reactive/balance.service";

/**
 * Estado retornado pelo hook
 */
export interface UseReactiveBalanceReturn {
  /** Saldo atual em reais */
  balance: number;
  /** Estado da conexão real-time */
  isConnected: boolean;
  /** Indica se está carregando o saldo inicial */
  isLoading: boolean;
  /** Erro, se houver */
  error: Error | null;
  /** Última atualização recebida */
  lastUpdate: BalanceUpdate | null;
  /** Estado completo da conexão */
  connectionState: ConnectionState;
  /** Função para atualizar o saldo manualmente */
  refreshBalance: () => Promise<void>;
  /** ID da conta sendo monitorada */
  accountId: string | null;
}

/**
 * Hook React para monitoramento de saldo em tempo real usando RxJS
 *
 * Funcionalidades:
 * - Conecta automaticamente ao serviço de saldo quando usuário e conta estão disponíveis
 * - Desconecta automaticamente ao desmontar o componente
 * - Fornece loading state durante a inicialização
 * - Gerencia erros de conexão
 * - Permite refresh manual do saldo
 *
 * Exemplo de uso:
 * ```tsx
 * function MyComponent() {
 *   const { balance, isConnected, isLoading } = useReactiveBalance();
 *
 *   if (isLoading) return <Text>Carregando...</Text>;
 *
 *   return (
 *     <View>
 *       <Text>Saldo: R$ {balance.toFixed(2)}</Text>
 *       <Text>Status: {isConnected ? '🟢 Conectado' : '🔴 Desconectado'}</Text>
 *     </View>
 *   );
 * }
 * ```
 */
export function useReactiveBalance(): UseReactiveBalanceReturn {
  const { user } = useAuth();
  const { data: account, isLoading: isLoadingAccount } =
    usePrimaryBankAccount();

  const [balance, setBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<BalanceUpdate | null>(null);
  const [connectionState, setConnectionState] = useState<ConnectionState>(
    balanceService.getConnectionState()
  );

  /**
   * Função para atualizar o saldo manualmente
   */
  const refreshBalance = useCallback(async () => {
    if (!account?.id) {
      console.warn(
        "⚠️ [useReactiveBalance] Tentativa de refresh sem conta disponível"
      );
      return;
    }

    try {
      await balanceService.refreshBalance(account.id);
    } catch (error) {
      console.error("❌ [useReactiveBalance] Erro ao fazer refresh:", error);
    }
  }, [account?.id]);

  // Efeito principal: gerencia o ciclo de vida do stream
  useEffect(() => {
    // Se ainda está carregando a conta ou não há usuário/conta, não faz nada
    if (isLoadingAccount || !user?.id || !account?.id) {
      console.log("⏳ [useReactiveBalance] Aguardando usuário e conta...", {
        isLoadingAccount,
        hasUser: !!user?.id,
        hasAccount: !!account?.id,
      });
      return;
    }

    console.log("🎯 [useReactiveBalance] Iniciando monitoramento", {
      userId: user.id,
      accountId: account.id,
    });

    let isSubscribed = true;

    // Iniciar o stream
    const startStream = async () => {
      try {
        setIsLoading(true);
        await balanceService.startBalanceStream(user.id, account.id);

        if (isSubscribed) {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("❌ [useReactiveBalance] Erro ao iniciar stream:", error);
        if (isSubscribed) {
          setIsLoading(false);
        }
      }
    };

    startStream();

    // Subscrever ao Observable de saldo
    const balanceSubscription = balanceService.balance$.subscribe({
      next: (newBalance) => {
        if (isSubscribed) {
          console.log("💰 [useReactiveBalance] Saldo atualizado:", newBalance);
          setBalance(newBalance);
        }
      },
      error: (err) => {
        console.error("❌ [useReactiveBalance] Erro no stream de saldo:", err);
      },
    });

    // Subscrever às atualizações completas (com metadados)
    const updatesSubscription = balanceService.balanceUpdates$.subscribe({
      next: (update) => {
        if (isSubscribed) {
          console.log(
            "📊 [useReactiveBalance] Atualização completa recebida:",
            update
          );
          setLastUpdate(update);
        }
      },
    });

    // Subscrever ao estado da conexão
    const connectionSubscription = balanceService.connectionState$.subscribe({
      next: (state) => {
        if (isSubscribed) {
          console.log("🔌 [useReactiveBalance] Estado da conexão:", state);
          setConnectionState(state);
        }
      },
    });

    // Cleanup: parar o stream e desinscrever dos Observables
    return () => {
      console.log("🧹 [useReactiveBalance] Limpando recursos...");
      isSubscribed = false;

      balanceSubscription.unsubscribe();
      updatesSubscription.unsubscribe();
      connectionSubscription.unsubscribe();

      // Nota: Não paramos o stream aqui pois pode ser usado por outros componentes
      // O stream será parado apenas quando não houver mais subscribers ou
      // quando o usuário fizer logout
    };
  }, [user?.id, account?.id, isLoadingAccount]);

  return {
    balance,
    isConnected: connectionState.isConnected,
    isLoading: isLoadingAccount || isLoading,
    error: connectionState.error,
    lastUpdate,
    connectionState,
    refreshBalance,
    accountId: account?.id || null,
  };
}

/**
 * Hook simplificado que retorna apenas o saldo
 * Útil quando você não precisa das informações extras
 */
export function useBalance(): number {
  const { balance } = useReactiveBalance();
  return balance;
}

/**
 * Hook que retorna o status da conexão
 */
export function useBalanceConnectionStatus(): {
  isConnected: boolean;
  error: Error | null;
} {
  const { isConnected, error } = useReactiveBalance();
  return { isConnected, error };
}
