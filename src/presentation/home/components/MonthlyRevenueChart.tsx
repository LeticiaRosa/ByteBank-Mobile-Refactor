/**
 * Presentation Layer - Monthly Revenue Chart
 * Componente de apresentação que usa adapter da infrastructure
 * Delega renderização para MonthlyRevenueChartView
 */

import { useMonthlyRevenueChartAdapter } from "../../../infrastructure/home/components";
import { MonthlyRevenueChartView } from "./MonthlyRevenueChartView";

export function MonthlyRevenueChart() {
  // Usa adapter da infrastructure que gerencia toda a lógica
  const {
    chartData,
    chartConfig,
    isLoading,
    error,
    hasData,
    theme,
    shouldRender,
  } = useMonthlyRevenueChartAdapter();

  if (!shouldRender) {
    return null;
  }

  return (
    <MonthlyRevenueChartView
      chartData={chartData}
      chartConfig={chartConfig}
      isLoading={isLoading}
      error={error}
      hasData={hasData}
      cardBackgroundColor={theme.cardBackgroundColor}
      borderColor={theme.borderColor}
    />
  );
}
