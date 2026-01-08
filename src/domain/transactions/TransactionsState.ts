/**
 * Domain Layer - Transactions State
 * Define os tipos e interfaces do domínio de transações
 * Camada independente de frameworks e bibliotecas
 */

import type {
  Transaction,
  CreateTransactionData,
} from "../../lib/transactions";
import type { BankAccount } from "../../hooks/useAuth";
import type {
  TransactionUpdate,
  ConnectionState,
} from "../../services/reactive/transactions.service";

export interface TransactionsState {
  // Transações
  transactions: Transaction[];
  isLoadingTransactions: boolean;
  transactionsError: Error | null;

  // Contas bancárias
  bankAccounts: BankAccount[] | undefined;
  primaryAccount: BankAccount | null | undefined;
  isLoadingAccounts: boolean;
  accountsError: Error | null;

  // Estados de operações
  isCreating: boolean;
  createTransactionError: Error | null;
  isUpdating: boolean;
  updateTransactionError: Error | null;
  isDeleting: boolean;
  deleteTransactionError: Error | null;

  // Estado da conexão real-time
  isConnected: boolean;
  lastUpdate: TransactionUpdate | null;
  connectionState: ConnectionState;

  // Edição de transação
  editingTransaction: Transaction | null;
}

export interface TransactionsActions {
  createTransaction: (data: CreateTransactionData) => Promise<Transaction>;
  updateTransaction: (
    transactionId: string,
    data: Partial<CreateTransactionData>
  ) => Promise<Transaction>;
  deleteTransaction: (transactionId: string) => Promise<void>;
  refreshTransactions: () => Promise<void>;
  refreshBankAccounts: () => void;
  setEditingTransaction: (transaction: Transaction | null) => void;
  cancelEdit: () => void;
  getTransaction: (id: string) => {
    transaction: Transaction | undefined;
    isLoading: boolean;
    error: Error | null;
  };
}
