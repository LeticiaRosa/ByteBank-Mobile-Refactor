/**
 * Presentation Layer - Transaction Form Container
 * Container component que gerencia a lógica e conecta com a camada de infraestrutura
 * Segue o padrão Container/Presenter
 */

import { useTransactionFormAdapter } from "../../infrastructure/transaction-form/useTransactionFormAdapter";
import { TransactionFormView } from "./TransactionFormView";
import type { BankAccount } from "../../hooks/useAuth";
import type {
  CreateTransactionData,
  Transaction,
} from "../../lib/transactions";

interface TransactionFormProps {
  primaryAccount: BankAccount | null | undefined;
  bankAccounts: BankAccount[] | undefined;
  isCreating: boolean;
  onCreateTransaction: (data: CreateTransactionData) => Promise<any>;
  isEditing?: boolean;
  editingTransaction?: Transaction | null;
  isUpdating?: boolean;
  onUpdateTransaction?: (
    transactionId: string,
    data: Partial<CreateTransactionData>
  ) => Promise<any>;
  onCancelEdit?: () => void;
}

export function TransactionForm({
  primaryAccount,
  bankAccounts,
  isCreating,
  onCreateTransaction,
  isEditing = false,
  editingTransaction = null,
  isUpdating = false,
  onUpdateTransaction,
  onCancelEdit,
}: TransactionFormProps) {
  const { state, actions, theme } = useTransactionFormAdapter({
    primaryAccount,
    bankAccounts,
    isCreating,
    onCreateTransaction,
    isEditing,
    editingTransaction,
    isUpdating,
    onUpdateTransaction,
    onCancelEdit,
  });

  return (
    <TransactionFormView
      state={state}
      actions={actions}
      colors={theme.colors}
      isDark={theme.isDark}
      isEditing={isEditing}
      editingTransaction={editingTransaction}
      onCancelEdit={onCancelEdit}
    />
  );
}
