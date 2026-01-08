/**
 * Presentation Layer - TransactionItem Container
 *
 * Container que conecta o adapter ao view.
 */

import { useTheme } from "../../../hooks/useTheme";
import { useTransactionItemAdapter } from "../../../infrastructure/extrato/useTransactionItemAdapter";
import { TransactionItemView } from "./TransactionItemView";
import type { TransactionItemProps } from "../../../domain/extrato/TransactionItemState";

export function TransactionItem(props: TransactionItemProps) {
  const { isDark } = useTheme();
  const { transaction, menuState, actions } = useTransactionItemAdapter(props);

  return (
    <TransactionItemView
      transaction={transaction}
      isDark={isDark}
      isMenuVisible={menuState.isVisible}
      onToggleMenu={actions.onToggleMenu}
      onEdit={actions.onEdit}
      onDelete={actions.onDelete}
      onProcess={actions.onProcess}
    />
  );
}
