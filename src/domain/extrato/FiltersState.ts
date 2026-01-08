/**
 * Domain Layer - Extract Filters
 *
 * Tipos e constantes para o componente de filtros de extrato.
 */

import type { FilterOptions } from "./ExtratoState";

export type { FilterOptions };

/**
 * Estado dos modais de seleção
 */
export interface FiltersModalState {
  showDateFromPicker: boolean;
  showDateToPicker: boolean;
  showTransactionTypeModal: boolean;
  showStatusModal: boolean;
  showCategoryModal: boolean;
}

/**
 * Ações disponíveis nos filtros
 */
export interface FiltersActions {
  onFilterChange: (key: keyof FilterOptions, value: string) => void;
  onReset: () => void;
  onToggleExpanded: () => void;
  onApplyQuickFilter: (days: number) => void;
  onDateChange: (
    date: Date | undefined,
    fieldName: "dateFrom" | "dateTo"
  ) => void;
  onToggleModal: (modalName: keyof FiltersModalState) => void;
}

/**
 * Opções para seletores
 */
export const FILTER_OPTIONS = {
  TRANSACTION_TYPES: [
    { value: "all", label: "Todos os tipos" },
    { value: "deposit", label: "Depósito" },
    { value: "withdrawal", label: "Saque" },
    { value: "transfer", label: "Transferência" },
    { value: "payment", label: "Pagamento" },
    { value: "fee", label: "Taxa" },
  ] as const,

  STATUS_OPTIONS: [
    { value: "all", label: "Todos os status" },
    { value: "completed", label: "Concluída" },
    { value: "pending", label: "Pendente" },
    { value: "failed", label: "Falhou" },
    { value: "cancelled", label: "Cancelada" },
  ] as const,
} as const;
