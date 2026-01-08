/**
 * Infrastructure Layer - Home Adapter
 *
 * Gerencia a lógica de estado e dados do dashboard Home.
 */

import { useEffect } from "react";
import { useReactiveBalance } from "../../hooks/useReactiveBalance";
import { useMonthlyFinancialSummary } from "../../hooks/useMonthlyFinancialSummary";
import { useStaggeredAnimation } from "../../hooks/useStaggeredAnimation";
import { HOME_CONSTANTS } from "../../domain/home/HomeState";
import type { HomeState, HomeActions } from "../../domain/home/HomeState";

export function useHomeAdapter() {
  // 🚀 Hook de saldo reativo com RxJS + Supabase Realtime
  const {
    balance: realtimeBalance,
    isConnected: isRealtimeConnected,
    isLoading: isLoadingRealtimeBalance,
  } = useReactiveBalance();

  // 📊 Resumo financeiro mensal
  const {
    monthlyRevenue,
    monthlyExpenses,
    revenueGrowth,
    expensesGrowth,
    isLoading: isLoadingFinancialSummary,
  } = useMonthlyFinancialSummary();

  // ✨ Animações escalonadas
  const { startAnimations, getAnimatedStyle } = useStaggeredAnimation(
    HOME_CONSTANTS.ANIMATION_CONFIG
  );

  // Iniciar animações quando dados carregarem
  useEffect(() => {
    if (!isLoadingRealtimeBalance && !isLoadingFinancialSummary) {
      startAnimations();
    }
  }, [isLoadingRealtimeBalance, isLoadingFinancialSummary, startAnimations]);

  const state: HomeState = {
    realtimeBalance,
    isRealtimeConnected,
    isLoadingRealtimeBalance,
    monthlyRevenue,
    monthlyExpenses,
    revenueGrowth,
    expensesGrowth,
    isLoadingFinancialSummary,
    animationsStarted: !isLoadingRealtimeBalance && !isLoadingFinancialSummary,
  };

  const actions: HomeActions = {
    startAnimations,
  };

  return {
    state,
    actions,
    getAnimatedStyle,
  };
}
