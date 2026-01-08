/**
 * Presentation Layer - Account Infos
 * Componente de apresentação que usa adapter da infrastructure
 * Delega renderização para AccountInfosView
 */

import { useAccountInfosAdapter } from "../../../infrastructure/home/components";
import type { AccountInfosProps } from "../../../domain/home/components";
import { AccountInfosView } from "./AccountInfosView";

export function AccountInfos(props: AccountInfosProps) {
  // Usa adapter da infrastructure que gerencia toda a lógica
  const viewState = useAccountInfosAdapter(props);

  return <AccountInfosView {...viewState} />;
}
