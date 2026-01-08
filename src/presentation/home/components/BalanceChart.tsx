/**
 * Presentation Layer - Balance Chart
 * Componente de apresentação que usa adapter da infrastructure
 * Delega renderização para BalanceChartView
 */

import { useBalanceChartAdapter } from "../../../infrastructure/home/components";
import { BalanceChartView } from "./BalanceChartView";

export function BalanceChart() {
  // Usa adapter da infrastructure que gerencia toda a lógica
  const {
    chartData,
    chartConfig,
    isLoading,
    error,
    hasData,
    theme,
    shouldRender,
  } = useBalanceChartAdapter();

  if (!shouldRender) {
    return null;
  }

  return (
    <BalanceChartView
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
