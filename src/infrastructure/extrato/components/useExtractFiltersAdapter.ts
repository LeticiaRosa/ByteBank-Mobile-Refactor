/**
 * Infrastructure Layer - Extract Filters Adapter
 * Adapter que conecta estado e lógica ao domínio
 */

import { useState } from "react";
import type { FilterOptions } from "../../../domain/extrato/ExtratoState";
import { DEFAULT_FILTERS } from "../../../domain/extrato/ExtratoState";
import type {
  ExtractFiltersProps,
  FiltersModalState,
  FiltersActions,
  ExtractFiltersViewState,
} from "../../../domain/extrato/components";
import { FILTERS_RULES as Rules } from "../../../domain/extrato/components";

/**
 * Hook adapter para ExtractFilters
 */
export function useExtractFiltersAdapter({
  onFilterChange,
  onReset,
}: ExtractFiltersProps): ExtractFiltersViewState {
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
    const dateFrom = Rules.getDateFromDaysAgo(days);
    const dateTo = Rules.getToday();

    const newFilters = {
      ...filters,
      dateFrom: dateFrom.toISOString().split("T")[0],
      dateTo: dateTo.toISOString().split("T")[0],
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

  const formatDisplayDate = (dateString?: Date | string): string => {
    return Rules.formatDisplayDate(dateString);
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
