/**
 * Domain Layer - Modal States
 *
 * Define tipos e regras de negócio para modais
 */

// ============= TYPES =============

export interface ModalState {
  visible: boolean;
  isLoading: boolean;
}

export interface ConfirmModalData {
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  isDangerous: boolean;
}

export interface ModalConfig {
  animationType: "fade" | "slide" | "none";
  transparent: boolean;
  dismissible: boolean;
}

// ============= BUSINESS RULES =============

export const MODAL_RULES = {
  /**
   * Valida se o modal pode ser fechado
   */
  canDismiss: (state: ModalState, config: ModalConfig): boolean => {
    return config.dismissible && !state.isLoading;
  },

  /**
   * Valida se a confirmação pode ser executada
   */
  canConfirm: (state: ModalState): boolean => {
    return !state.isLoading;
  },

  /**
   * Valida configuração do modal
   */
  validateModalConfig: (config: ModalConfig): boolean => {
    return (
      ["fade", "slide", "none"].includes(config.animationType) &&
      typeof config.transparent === "boolean" &&
      typeof config.dismissible === "boolean"
    );
  },

  /**
   * Cria mensagem de confirmação de exclusão
   */
  getDeleteConfirmationMessage: (itemType: string): string => {
    return `Tem certeza que deseja excluir ${itemType}? Esta ação não pode ser desfeita.`;
  },
} as const;

// ============= CONSTANTS =============

export const MODAL_DEFAULTS = {
  CONFIG: {
    animationType: "fade" as const,
    transparent: true,
    dismissible: true,
  },
  DELETE_CONFIRMATION: {
    title: "Confirmar Exclusão",
    message: "Tem certeza que deseja excluir esta transação?",
    confirmText: "Excluir",
    cancelText: "Cancelar",
    isDangerous: true,
  },
} as const;
