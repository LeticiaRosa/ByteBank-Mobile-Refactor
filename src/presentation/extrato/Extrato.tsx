/**
 * Presentation Layer - Extrato Container
 *
 * Container que conecta o adapter (infrastructure) ao view (presentation).
 * Responsável apenas por conectar as camadas.
 */

import { useExtratoAdapter } from "../../infrastructure/extrato/useExtratoAdapter";
import { ExtratoView } from "./ExtratoView";

export function Extrato() {
  const { state, actions, filters, bankAccounts, primaryAccount, isUpdating } =
    useExtratoAdapter();

  return (
    <ExtratoView
      state={state}
      actions={actions}
      filters={filters}
      bankAccounts={bankAccounts}
      primaryAccount={primaryAccount}
      isUpdating={isUpdating}
    />
  );
}
