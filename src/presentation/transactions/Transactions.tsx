/**
 * Presentation Layer - Transactions Container
 * Container component que gerencia a lógica e conecta com a camada de infraestrutura
 * Segue o padrão Container/Presenter
 */

import { useTransactionsAdapter } from "../../infrastructure/transactions/useTransactionsAdapter";
import { TransactionsView } from "./TransactionsView";

export function Transactions() {
  const { state, actions } = useTransactionsAdapter();

  return <TransactionsView state={state} actions={actions} />;
}
