/**
 * Infrastructure Layer - TransactionItem Adapter
 *
 * Gerencia o estado do menu do item de transação.
 */

import { useState } from "react";
import type {
  TransactionItemProps,
  TransactionItemMenuState,
  TransactionItemActions,
} from "../../domain/extrato/TransactionItemState";

export function useTransactionItemAdapter({
  transaction,
  onEdit,
  onDelete,
  onProcess,
}: TransactionItemProps) {
  const [isMenuVisible, setIsMenuVisible] = useState(false);

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
    onProcess?.(transaction.id, action);
  };

  const menuState: TransactionItemMenuState = {
    isVisible: isMenuVisible,
  };

  const actions: TransactionItemActions = {
    onToggleMenu: handleToggleMenu,
    onEdit: onEdit ? handleEdit : undefined,
    onDelete: onDelete ? handleDelete : undefined,
    onProcess: onProcess ? handleProcess : undefined,
  };

  return {
    transaction,
    menuState,
    actions,
  };
}
