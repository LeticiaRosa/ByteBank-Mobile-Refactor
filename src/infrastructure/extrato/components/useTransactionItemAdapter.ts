/**
 * Infrastructure Layer - TransactionItem Adapter
 * Adapter que conecta estado, tema e lógica ao domínio
 */

import { useState } from "react";
import { useTheme } from "../../../hooks/useTheme";
import type {
  TransactionItemProps,
  TransactionItemViewState,
} from "../../../domain/extrato/components";

/**
 * Hook adapter para TransactionItem
 */
export function useTransactionItemAdapter({
  transaction,
  onEdit,
  onDelete,
  onProcess,
}: TransactionItemProps): TransactionItemViewState {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const { isDark } = useTheme();

  const handleToggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const handleEdit = () => {
    setIsMenuVisible(false);
    onEdit?.(transaction);
  };

  const handleDelete = () => {
    setIsMenuVisible(false);
    onDelete?.(transaction.id);
  };

  const handleProcess = (action: "complete" | "fail") => {
    setIsMenuVisible(false);
    onProcess?.(transaction.id, action);
  };

  return {
    transaction,
    isDark,
    isMenuVisible,
    onToggleMenu: handleToggleMenu,
    onEdit: onEdit ? handleEdit : undefined,
    onDelete: onDelete ? handleDelete : undefined,
    onProcess: onProcess ? handleProcess : undefined,
  };
}
