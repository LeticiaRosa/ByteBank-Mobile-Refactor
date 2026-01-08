/**
 * Infrastructure Layer - Extrato
 *
 * Adapter que gerencia a lógica de negócio e adapta hooks externos
 * para a camada de apresentação.
 */

import { useState, useMemo } from "react";
import { useTransactions } from "../../hooks/useTransactions";
import { useBankAccounts } from "../../hooks/useBankAccounts";
import { useFilteredTransactions } from "../../hooks/useFilteredTransactions";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";
import { useToast } from "../../hooks/useToast";
import type {
  FilterOptions,
  DeleteModalState,
  EditModalState,
  ExtratoState,
  ExtratoActions,
} from "../../domain/extrato/ExtratoState";
import {
  DEFAULT_FILTERS,
  EXTRATO_CONSTANTS,
} from "../../domain/extrato/ExtratoState";
import type {
  Transaction,
  CreateTransactionData,
  PaginationOptions,
} from "../../lib/transactions";

const { PAGE_SIZE } = EXTRATO_CONSTANTS;

/**
 * Hook adapter para o componente Extrato
 * Encapsula toda a lógica de negócio e estado
 */
export function useExtratoAdapter() {
  // Hooks externos
  const {
    deleteTransaction,
    updateTransaction,
    isUpdating,
    transactions: allTransactions,
    isLoadingTransactions,
  } = useTransactions();
  const { data: bankAccounts } = useBankAccounts();
  const { user } = useAuth();
  const { isDark } = useTheme();
  const { transactionSuccess, transactionError } = useToast();

  // Estado local
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FilterOptions>(DEFAULT_FILTERS);

  const [deleteModal, setDeleteModal] = useState<DeleteModalState>({
    visible: false,
    transactionId: "",
    isDeleting: false,
  });

  const [editModal, setEditModal] = useState<EditModalState>({
    visible: false,
    transaction: null,
  });

  // Verificar se há filtros ativos
  const hasActiveFilters = useMemo(() => {
    return Object.entries(filters).some(([key, value]) => {
      if (key === "transactionType" || key === "status" || key === "category") {
        return value !== "all";
      }
      return value !== "" && value.trim() !== "";
    });
  }, [filters]);

  // Configurar paginação
  const paginationOptions: PaginationOptions = {
    page: currentPage,
    pageSize: PAGE_SIZE,
  };

  // Usar transações filtradas quando há filtros ativos
  const {
    data: filteredResult,
    isLoading: isLoadingFiltered,
    error: errorFiltered,
  } = useFilteredTransactions(
    filters,
    user?.id || "",
    paginationOptions,
    hasActiveFilters && !!user?.id
  );

  // Determinar qual resultado usar
  const result = useMemo(() => {
    if (hasActiveFilters && filteredResult) {
      return filteredResult;
    }

    // Para transações sem filtro, aplicar paginação manual
    if (allTransactions) {
      const startIndex = (currentPage - 1) * PAGE_SIZE;
      const endIndex = startIndex + PAGE_SIZE;
      const paginatedData = allTransactions.slice(startIndex, endIndex);

      return {
        data: paginatedData,
        pagination: {
          page: currentPage,
          pageSize: PAGE_SIZE,
          total: allTransactions.length,
          from: startIndex,
          to: Math.min(endIndex - 1, allTransactions.length - 1),
          hasNextPage: endIndex < allTransactions.length,
          hasPreviousPage: currentPage > 1,
        },
      };
    }

    return null;
  }, [hasActiveFilters, filteredResult, allTransactions, currentPage]);

  // Determinar estado de loading
  const isLoading = hasActiveFilters
    ? isLoadingFiltered
    : isLoadingTransactions;

  // Handlers
  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset para primeira página quando filtros mudam
  };

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditModal({
      visible: true,
      transaction,
    });
  };

  const handleCloseEditModal = () => {
    setEditModal({
      visible: false,
      transaction: null,
    });
  };

  const handleUpdateTransaction = async (
    transactionId: string,
    data: Partial<CreateTransactionData>
  ) => {
    try {
      await updateTransaction(transactionId, data);
      transactionSuccess("Transação atualizada com sucesso");
      handleCloseEditModal();
    } catch (error) {
      transactionError("Não foi possível atualizar a transação");
      throw error;
    }
  };

  const handleDeleteTransaction = (transactionId: string) => {
    setDeleteModal({
      visible: true,
      transactionId,
      isDeleting: false,
    });
  };

  const confirmDeleteTransaction = async () => {
    setDeleteModal((prev) => ({ ...prev, isDeleting: true }));

    try {
      await deleteTransaction(deleteModal.transactionId);
      transactionSuccess("Transação excluída com sucesso");
      setDeleteModal({ visible: false, transactionId: "", isDeleting: false });
    } catch (error) {
      transactionError("Não foi possível excluir a transação");
      setDeleteModal((prev) => ({ ...prev, isDeleting: false }));
    }
  };

  const cancelDeleteTransaction = () => {
    setDeleteModal({ visible: false, transactionId: "", isDeleting: false });
  };

  const handleProcessTransaction = async (
    transactionId: string,
    action: "complete" | "fail"
  ) => {
    try {
      transactionSuccess(
        `Transação ${transactionId.slice(-8)} ${
          action === "complete" ? "concluída" : "marcada como falha"
        } com sucesso`
      );
    } catch (error) {
      transactionError("Não foi possível processar a transação");
    }
  };

  // Estado para passar ao componente
  const state: ExtratoState = {
    transactions: result?.data || [],
    hasActiveFilters,
    isLoading,
    error: errorFiltered,
    currentPage,
    paginationInfo: result?.pagination || null,
    deleteModal,
    editModal,
    isDark,
  };

  // Ações para passar ao componente
  const actions: ExtratoActions = {
    onFilterChange: handleFilterChange,
    onResetFilters: handleResetFilters,
    onPageChange: handlePageChange,
    onEditTransaction: handleEditTransaction,
    onDeleteTransaction: handleDeleteTransaction,
    onUpdateTransaction: handleUpdateTransaction,
    onProcessTransaction: handleProcessTransaction,
    onCloseEditModal: handleCloseEditModal,
    onConfirmDelete: confirmDeleteTransaction,
    onCancelDelete: cancelDeleteTransaction,
  };

  // Dados adicionais
  const primaryAccount =
    bankAccounts?.find((acc) => acc.user_id === user?.id) || null;

  return {
    state,
    actions,
    filters,
    bankAccounts,
    primaryAccount,
    isUpdating,
  };
}
