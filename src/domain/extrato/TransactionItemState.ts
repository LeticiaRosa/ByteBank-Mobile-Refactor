/**
 * Domain Layer - TransactionItem State
 *
 * Define os tipos e interfaces para o componente TransactionItem.
 */

import type { Transaction } from "../../lib/transactions";

/**
 * Props que o componente TransactionItem recebe
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
