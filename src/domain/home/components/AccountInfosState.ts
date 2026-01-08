/**
 * Domain Layer - Account Infos State
 * Define tipos, interfaces e regras de negócio para o componente AccountInfos
 */

import { ReactNode } from "react";
import { Animated } from "react-native";

/**
 * Props públicas do componente AccountInfos
 */
export interface AccountInfosProps {
  title?: string;
  amount: number;
  text?: string;
  isLoadingAccounts: boolean;
  showeye?: boolean;
  colorType?: "primary" | "success" | "destructive";
  formatType?: "currency" | "number";
  icon?: ReactNode;
  isRealtimeConnected?: boolean;
}

/**
 * Estado interno do componente AccountInfos
 */
export interface AccountInfosState {
  isBalanceVisible: boolean;
  scaleAnim: Animated.Value;
  opacityAnim: Animated.Value;
  skeletonStyle: any;
  theme: {
    cardForegroundColor: string;
    cardBackgroundColor: string;
    iconColor: string;
    borderColor: string;
    mutedColor: string;
  };
}

/**
 * Ações disponíveis para o componente
 */
export interface AccountInfosActions {
  toggleBalanceVisibility: () => void;
  handlePressIn: () => void;
  handlePressOut: () => void;
}

/**
 * Funções de formatação e utilitários
 */
export interface AccountInfosUtils {
  formatValue: (value: number) => string;
  getAmountColorClass: () => string;
}

/**
 * Estado completo para a View
 */
export interface AccountInfosViewState
  extends AccountInfosProps,
    AccountInfosState,
    AccountInfosActions,
    AccountInfosUtils {}

/**
 * Regras de negócio do domínio
 */
export const ACCOUNT_INFOS_RULES = {
  /**
   * Verifica se o valor deve ser exibido
   */
  shouldDisplayAmount: (amount: number): boolean => amount >= 0,

  /**
   * Verifica se o componente está em estado de loading
   */
  isLoading: (isLoadingAccounts: boolean): boolean => isLoadingAccounts,

  /**
   * Determina a classe de cor baseada no tipo
   */
  getColorClass: (colorType: "primary" | "success" | "destructive"): string => {
    switch (colorType) {
      case "success":
        return "text-green-600 dark:text-green-400";
      case "destructive":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-primary";
    }
  },

  /**
   * Formata valor baseado no tipo de formatação
   */
  formatValue: (value: number, formatType: "currency" | "number"): string => {
    if (formatType === "number") {
      return value.toLocaleString("pt-BR");
    }
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  },
} as const;
