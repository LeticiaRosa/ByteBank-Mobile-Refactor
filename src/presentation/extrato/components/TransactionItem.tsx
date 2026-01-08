/**
 * Presentation Layer - TransactionItem
 * Componente de apresentação que usa adapter da infrastructure
 * Delega renderização para TransactionItemView
 */

import { useTransactionItemAdapter } from "../../../infrastructure/extrato/components";
import type { TransactionItemProps } from "../../../domain/extrato/components";
import { TransactionItemView } from "./TransactionItemView";

export function TransactionItem(props: TransactionItemProps) {
  // Usa adapter da infrastructure que gerencia toda a lógica
  const viewState = useTransactionItemAdapter(props);

  return <TransactionItemView {...viewState} />;
}
