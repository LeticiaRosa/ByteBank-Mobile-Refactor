/**
 * Domain Layer - Toast States
 *
 * Define tipos e regras de negócio para notificações toast
 */

// ============= TYPES =============

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastConfig {
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

export interface ToastStyle {
  borderLeftColor: string;
  backgroundColor: string;
  borderLeftWidth: number;
}

// ============= BUSINESS RULES =============

export const TOAST_RULES = {
  /**
   * Obtém cor da borda baseada no tipo
   */
  getBorderColor: (type: ToastType): string => {
    const colors: Record<ToastType, string> = {
      success: "#22c55e",
      error: "#ef4444",
      info: "#3b82f6",
      warning: "#f59e0b",
    };
    return colors[type];
  },

  /**
   * Valida configuração do toast
   */
  validateToastConfig: (config: ToastConfig): boolean => {
    return (
      ["success", "error", "info", "warning"].includes(config.type) &&
      config.title.length > 0 &&
      (config.duration === undefined || config.duration > 0)
    );
  },

  /**
   * Calcula duração automática baseada no tamanho da mensagem
   */
  calculateAutoDuration: (message: string): number => {
    const BASE_DURATION = 3000;
    const CHARS_PER_SECOND = 15;
    const additionalTime = Math.ceil(message.length / CHARS_PER_SECOND) * 1000;
    return BASE_DURATION + additionalTime;
  },
} as const;

// ============= CONSTANTS =============

export const TOAST_DEFAULTS = {
  DURATION: 3000,
  BACKGROUND_COLOR: "#ffffff",
  BORDER_WIDTH: 5,
  STYLE: {
    marginHorizontal: 16,
    borderRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  TEXT_STYLE: {
    title: {
      fontSize: 16,
      fontWeight: "600" as const,
      color: "#1f2937",
    },
    message: {
      fontSize: 14,
      fontWeight: "400" as const,
      color: "#6b7280",
      lineHeight: 18,
    },
  },
} as const;
