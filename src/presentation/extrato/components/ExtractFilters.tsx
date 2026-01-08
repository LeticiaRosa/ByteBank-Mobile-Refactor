/**
 * Presentation Layer - ExtractFilters
 * Componente de apresentação que usa adapter da infrastructure
 * Delega renderização para ExtractFiltersView
 */

import { useExtractFiltersAdapter } from "../../../infrastructure/extrato/components";
import type { ExtractFiltersProps } from "../../../domain/extrato/components";
import { ExtractFiltersView } from "./ExtractFiltersView";

export function ExtractFilters(props: ExtractFiltersProps) {
  // Usa adapter da infrastructure que gerencia toda a lógica
  const viewState = useExtractFiltersAdapter(props);

  return <ExtractFiltersView {...viewState} />;
}

// Re-exportar tipos para compatibilidade
export type { ExtractFiltersProps };
