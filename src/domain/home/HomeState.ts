/**
 * Domain Layer - Home State
 *
 * Define os tipos, interfaces e estados do módulo Home.
 */

/**
 * Estado do dashboard Home
 */
export interface HomeState {
  // Saldo reativo
  realtimeBalance: number;
  isRealtimeConnected: boolean;
  isLoadingRealtimeBalance: boolean;

  // Resumo financeiro mensal
  monthlyRevenue: number;
  monthlyExpenses: number;
  revenueGrowth: string;
  expensesGrowth: string;
  isLoadingFinancialSummary: boolean;

  // Animações
  animationsStarted: boolean;
}

/**
 * Ações disponíveis no Home
 */
export interface HomeActions {
  startAnimations: () => void;
}

/**
 * Props do componente Home
 */
export interface HomeProps {
  // Pode receber props de navegação no futuro
}

/**
 * Configuração de animações
 */
export interface AnimationConfig {
  itemCount: number;
  duration: number;
  staggerDelay: number;
  initialDelay: number;
}

/**
 * Constantes do domínio
 */
export const HOME_CONSTANTS = {
  ANIMATION_CONFIG: {
    itemCount: 6,
    duration: 600,
    staggerDelay: 150,
    initialDelay: 200,
  },
} as const;
