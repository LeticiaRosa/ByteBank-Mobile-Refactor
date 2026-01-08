/**
 * Presentation Layer - Transactions View
 * Componente de apresentação puro (stateless)
 * Responsável apenas pela renderização visual do formulário de transações
 * Segue o princípio de Responsabilidade Única (S do SOLID)
 */

import { View, Text, ActivityIndicator } from "react-native";
import type {
  TransactionsState,
  TransactionsActions,
} from "../../domain/transactions/TransactionsState";
import { TransactionForm } from "../transaction-form/TransactionForm";

interface TransactionsViewProps {
  state: TransactionsState;
  actions: TransactionsActions;
}

export function TransactionsView({ state, actions }: TransactionsViewProps) {
  const {
    bankAccounts,
    primaryAccount,
    isLoadingAccounts,
    isCreating,
    isUpdating,
    editingTransaction,
  } = state;

  const { createTransaction, updateTransaction, cancelEdit } = actions;

  if (isLoadingAccounts) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <View style={{ alignItems: "center" }}>
          <ActivityIndicator size="large" color="#0066cc" />
          <Text style={{ marginTop: 12, fontSize: 16, color: "#6b7280" }}>
            Carregando transações...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }} className="bg-gray-1 dark:bg-gray-12">
      <TransactionForm
        primaryAccount={primaryAccount}
        bankAccounts={bankAccounts}
        isCreating={isCreating}
        onCreateTransaction={createTransaction}
        isEditing={!!editingTransaction}
        editingTransaction={editingTransaction}
        isUpdating={isUpdating}
        onUpdateTransaction={updateTransaction}
        onCancelEdit={cancelEdit}
      />
    </View>
  );
}
