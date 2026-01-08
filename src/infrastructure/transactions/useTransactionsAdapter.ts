/**
 * Infrastructure Layer - Transactions Adapter
 * Adapta hook useTransactions para a camada de apresentação
 * Isola implementações técnicas da camada de apresentação
 */

import { useState } from "react";
import { useTransactions } from "../../hooks/useTransactions";
import type {
  TransactionsState,
  TransactionsActions,
} from "../../domain/transactions/TransactionsState";
import type { Transaction } from "../../lib/transactions";

export interface TransactionsAdapter {
  state: TransactionsState;
  actions: TransactionsActions;
}

/**
 * Hook adapter que conecta o useTransactions original à arquitetura limpa
 */
export function useTransactionsAdapter(): TransactionsAdapter {
  const {
    transactions,
    isLoadingTransactions,
    transactionsError,
    bankAccounts,
    primaryAccount,
    isLoadingAccounts,
    accountsError,
    isCreating,
    createTransactionError,
    isUpdating,
    updateTransactionError,
    isDeleting,
    deleteTransactionError,
    isConnected,
    lastUpdate,
    connectionState,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    refreshTransactions,
    refreshBankAccounts,
    getTransaction,
  } = useTransactions();

  // Estado local para edição de transação
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

  const state: TransactionsState = {
    transactions,
    isLoadingTransactions,
    transactionsError,
    bankAccounts,
    primaryAccount,
    isLoadingAccounts,
    accountsError,
    isCreating,
    createTransactionError,
    isUpdating,
    updateTransactionError,
    isDeleting,
    deleteTransactionError,
    isConnected,
    lastUpdate,
    connectionState,
    editingTransaction,
  };

  const actions: TransactionsActions = {
    createTransaction,
    updateTransaction,
    deleteTransaction,
    refreshTransactions,
    refreshBankAccounts,
    setEditingTransaction,
    cancelEdit: () => setEditingTransaction(null),
    getTransaction,
  };

  return {
    state,
    actions,
  };
}
