/**
 * Presentation Layer - ExtractFilters Container
 *
 * Container que conecta adapter ao view.
 */

import { useFiltersAdapter } from "../../../infrastructure/extrato/useFiltersAdapter";
import { ExtractFiltersView } from "./ExtractFiltersView";
import type { FilterOptions } from "../../../domain/extrato/ExtratoState";

interface ExtractFiltersProps {
  onFilterChange: (filters: FilterOptions) => void;
  onReset: () => void;
}

export function ExtractFilters({
  onFilterChange,
  onReset,
}: ExtractFiltersProps) {
  const { filters, isExpanded, modalsState, actions, formatDisplayDate } =
    useFiltersAdapter({ onFilterChange, onReset });

  return (
    <ExtractFiltersView
      filters={filters}
      isExpanded={isExpanded}
      modalsState={modalsState}
      actions={actions}
      formatDisplayDate={formatDisplayDate}
    />
  );
}

// Re-exportar tipos para compatibilidade
export type { FilterOptions };
