/**
 * Domain Layer - Extrato
 *
 * Tipos puros e interfaces do domínio de extrato de transações.
 * Não contém lógica de negócio nem dependências externas.
 */

import type {
  Transaction,
  CreateTransactionData,
} from "../../lib/transactions";

/**
 * Opções de filtro para transações
 */
export interface FilterOptions {
  dateFrom: string;
  dateTo: string;
  transactionType:
    | "all"
    | "deposit"
    | "withdrawal"
    | "transfer"
    | "payment"
    | "fee";
  status: "all" | "completed" | "pending" | "failed" | "cancelled";
  minAmount: string;
  maxAmount: string;
  description: string;
  category:
    | "all"
    | "alimentacao"
    | "transporte"
    | "saude"
    | "educacao"
    | "entretenimento"
    | "compras"
    | "casa"
    | "trabalho"
    | "investimentos"
    | "viagem"
    | "outros";
  senderName: string;
}

/**
 * Estado do modal de exclusão
 */
export interface DeleteModalState {
  visible: boolean;
  transactionId: string;
  isDeleting: boolean;
}

/**
 * Estado do modal de edição
 */
export interface EditModalState {
  visible: boolean;
  transaction: Transaction | null;
}

/**
 * Informações de paginação
 */
export interface PaginationInfo {
  page: number;
  pageSize: number;
  total?: number;
  from: number;
  to: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Resultado paginado de transações
 */
export interface PaginatedTransactions {
  data: Transaction[];
  pagination: PaginationInfo;
}

/**
 * Estado completo do extrato
 */
export interface ExtratoState {
  // Dados
  transactions: Transaction[];
  hasActiveFilters: boolean;
  isLoading: boolean;
  error: Error | null;

  // Paginação
  currentPage: number;
  paginationInfo: PaginationInfo | null;

  // Modais
  deleteModal: DeleteModalState;
  editModal: EditModalState;

  // Tema
  isDark: boolean;
}

/**
 * Ações disponíveis no extrato
 */
export interface ExtratoActions {
  // Filtros
  onFilterChange: (filters: FilterOptions) => void;
  onResetFilters: () => void;

  // Paginação
  onPageChange: (page: number) => void;

  // Transações
  onEditTransaction: (transaction: Transaction) => void;
  onDeleteTransaction: (transactionId: string) => void;
  onUpdateTransaction: (
    transactionId: string,
    data: Partial<CreateTransactionData>
  ) => Promise<void>;
  onProcessTransaction: (
    transactionId: string,
    action: "complete" | "fail"
  ) => Promise<void>;

  // Modais
  onCloseEditModal: () => void;
  onConfirmDelete: () => Promise<void>;
  onCancelDelete: () => void;
}

/**
 * Constantes do domínio
 */
export const EXTRATO_CONSTANTS = {
  PAGE_SIZE: 10,

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

  TRANSACTION_CATEGORIES: [
    { value: "all", label: "Todas as categorias" },
    { value: "alimentacao", label: "Alimentação" },
    { value: "transporte", label: "Transporte" },
    { value: "saude", label: "Saúde" },
    { value: "educacao", label: "Educação" },
    { value: "entretenimento", label: "Entretenimento" },
    { value: "compras", label: "Compras" },
    { value: "casa", label: "Casa" },
    { value: "trabalho", label: "Trabalho" },
    { value: "investimentos", label: "Investimentos" },
    { value: "viagem", label: "Viagem" },
    { value: "outros", label: "Outros" },
  ] as const,
} as const;

/**
 * Filtros iniciais/padrão
 */
export const DEFAULT_FILTERS: FilterOptions = {
  dateFrom: "",
  dateTo: "",
  transactionType: "all",
  status: "all",
  minAmount: "",
  maxAmount: "",
  description: "",
  category: "all",
  senderName: "",
};
