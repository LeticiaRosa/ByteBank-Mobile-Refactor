/**
 * Domain Layer - Extract Filters State
 * Define tipos, interfaces e regras de negócio para o componente de filtros
 */

import type { FilterOptions } from "../ExtratoState";

export type { FilterOptions };

/**
 * Props do componente ExtractFilters
 */
export interface ExtractFiltersProps {
  onFilterChange: (filters: FilterOptions) => void;
  onReset: () => void;
}

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
 * Estado completo para a View
 */
export interface ExtractFiltersViewState {
  filters: FilterOptions;
  isExpanded: boolean;
  modalsState: FiltersModalState;
  actions: FiltersActions;
  formatDisplayDate: (date?: Date | string) => string;
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

/**
 * Regras de negócio para filtros
 */
export const FILTERS_RULES = {
  /**
   * Formata data para exibição
   */
  formatDisplayDate: (date?: Date | string): string => {
    if (!date) return "Selecione";
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return new Intl.DateTimeFormat("pt-BR").format(dateObj);
  },

  /**
   * Calcula data inicial com base em dias atrás
   */
  getDateFromDaysAgo: (days: number): Date => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date;
  },

  /**
   * Obtém data de hoje
   */
  getToday: (): Date => {
    return new Date();
  },

  /**
   * Valida se dateFrom é anterior a dateTo
   */
  isValidDateRange: (dateFrom?: Date, dateTo?: Date): boolean => {
    if (!dateFrom || !dateTo) return true;
    return dateFrom <= dateTo;
  },
} as const;
