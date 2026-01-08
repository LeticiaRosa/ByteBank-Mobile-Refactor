/**
 * Domain Layer - Text States
 *
 * Define tipos e regras de negócio para componentes de texto
 */

// ============= TYPES =============

export interface TextConfig {
  className?: string;
  baseClasses: string;
}

export interface TextStyle {
  fontSize: number;
  fontWeight: string;
  color: string;
  lineHeight?: number;
}

// ============= BUSINESS RULES =============

export const TEXT_RULES = {
  /**
   * Combina classes CSS
   */
  combineClasses: (baseClasses: string, customClasses?: string): string => {
    return customClasses ? `${baseClasses} ${customClasses}` : baseClasses;
  },

  /**
   * Valida classes CSS
   */
  validateClasses: (classes: string): boolean => {
    return typeof classes === "string" && classes.length > 0;
  },
} as const;

// ============= CONSTANTS =============

export const TEXT_DEFAULTS = {
  BASE_CLASSES: "pl-2 text-gray-12 dark:text-gray-1",
} as const;
