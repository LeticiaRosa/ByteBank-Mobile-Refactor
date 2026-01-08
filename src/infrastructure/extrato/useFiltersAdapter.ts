/**
 * Infrastructure Layer - Extract Filters Adapter
 *
 * Gerencia a lógica de estado dos filtros.
 */

import { useState } from "react";
import type { FilterOptions } from "../../domain/extrato/ExtratoState";
import { DEFAULT_FILTERS } from "../../domain/extrato/ExtratoState";
import type {
  FiltersModalState,
  FiltersActions,
} from "../../domain/extrato/FiltersState";

interface UseFiltersAdapterProps {
  onFilterChange: (filters: FilterOptions) => void;
  onReset: () => void;
}

export function useFiltersAdapter({
  onFilterChange,
  onReset,
}: UseFiltersAdapterProps) {
  const [filters, setFilters] = useState<FilterOptions>(DEFAULT_FILTERS);
  const [isExpanded, setIsExpanded] = useState(false);

  const [modalsState, setModalsState] = useState<FiltersModalState>({
    showDateFromPicker: false,
    showDateToPicker: false,
    showTransactionTypeModal: false,
    showStatusModal: false,
    showCategoryModal: false,
  });

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
    onReset();
  };

  const handleToggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleApplyQuickFilter = (days: number) => {
    const today = new Date();
    const pastDate = new Date();
    pastDate.setDate(today.getDate() - days);

    const newFilters = {
      ...filters,
      dateFrom: pastDate.toISOString().split("T")[0],
      dateTo: today.toISOString().split("T")[0],
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleDateChange = (
    date: Date | undefined,
    fieldName: "dateFrom" | "dateTo"
  ) => {
    // Fechar o picker
    setModalsState((prev) => ({
      ...prev,
      showDateFromPicker: false,
      showDateToPicker: false,
    }));

    if (date) {
      const formattedDate = date.toISOString().split("T")[0];
      handleFilterChange(fieldName, formattedDate);
    }
  };

  const handleToggleModal = (modalName: keyof FiltersModalState) => {
    setModalsState((prev) => ({
      ...prev,
      [modalName]: !prev[modalName],
    }));
  };

  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  const actions: FiltersActions = {
    onFilterChange: handleFilterChange,
    onReset: handleReset,
    onToggleExpanded: handleToggleExpanded,
    onApplyQuickFilter: handleApplyQuickFilter,
    onDateChange: handleDateChange,
    onToggleModal: handleToggleModal,
  };

  return {
    filters,
    isExpanded,
    modalsState,
    actions,
    formatDisplayDate,
  };
}
