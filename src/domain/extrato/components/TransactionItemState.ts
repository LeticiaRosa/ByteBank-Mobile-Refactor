/**
 * Domain Layer - TransactionItem State
 * Define tipos, interfaces e regras de negócio para o componente TransactionItem
 */

import type { Transaction } from "../../../lib/transactions";

/**
 * Props do componente TransactionItem
 */
export interface TransactionItemProps {
  transaction: Transaction;
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (transactionId: string) => void;
  onProcess?: (transactionId: string, action: "complete" | "fail") => void;
}

/**
 * Estado interno do menu do TransactionItem
 */
export interface TransactionItemMenuState {
  isVisible: boolean;
}

/**
 * Ações disponíveis no TransactionItem
 */
export interface TransactionItemActions {
  onToggleMenu: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onProcess?: (action: "complete" | "fail") => void;
}

/**
 * Estado completo para a View
 */
export interface TransactionItemViewState {
  transaction: Transaction;
  isDark: boolean;
  isMenuVisible: boolean;
  onToggleMenu: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onProcess?: (action: "complete" | "fail") => void;
}

/**
 * Tema do TransactionItem
 */
export interface TransactionItemTheme {
  backgroundColor: string;
  borderColor: string;
  textColor: string;
}

/**
 * Regras de negócio para TransactionItem
 */
export const TRANSACTION_ITEM_RULES = {
  /**
   * Verifica se a transação está pendente
   */
  isPending: (transaction: Transaction): boolean => {
    return transaction.status === "pending";
  },

  /**
   * Verifica se a transação está completa
   */
  isCompleted: (transaction: Transaction): boolean => {
    return transaction.status === "completed";
  },

  /**
   * Verifica se a transação falhou
   */
  isFailed: (transaction: Transaction): boolean => {
    return transaction.status === "failed";
  },

  /**
   * Verifica se pode editar a transação
   */
  canEdit: (transaction: Transaction): boolean => {
    return transaction.status === "pending" || transaction.status === "failed";
  },

  /**
   * Verifica se pode deletar a transação
   */
  canDelete: (transaction: Transaction): boolean => {
    return true; // Todas podem ser deletadas
  },

  /**
   * Verifica se pode processar a transação
   */
  canProcess: (transaction: Transaction): boolean => {
    return transaction.status === "pending";
  },

  /**
   * Formata valor da transação
   */
  formatAmount: (amount: number): string => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount / 100); // Valor em centavos
  },

  /**
   * Formata data da transação
   */
  formatDate: (date: string | Date): string => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return new Intl.DateTimeFormat("pt-BR").format(dateObj);
  },

  /**
   * Obtém classe de cor baseada no tipo de transação
   */
  getColorClass: (type: string): string => {
    switch (type) {
      case "deposit":
        return "text-green-600 dark:text-green-400";
      case "withdrawal":
        return "text-red-600 dark:text-red-400";
      case "transfer":
        return "text-blue-600 dark:text-blue-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  },

  /**
   * Obtém ícone baseado no tipo de transação
   */
  getIconType: (
    type: string
  ): "deposit" | "withdrawal" | "transfer" | "payment" => {
    return type as "deposit" | "withdrawal" | "transfer" | "payment";
  },
} as const;
