/**
 * Presentation Layer - Expenses Pie Chart
 * Componente de apresentação que usa adapter da infrastructure
 * Delega renderização para ExpensesPieChartView
 */

import { useExpensesPieChartAdapter } from "../../../infrastructure/home/components";
import { ExpensesPieChartView } from "./ExpensesPieChartView";

export function ExpensesPieChart() {
  // Usa adapter da infrastructure que gerencia toda a lógica
  const {
    chartData,
    chartConfig,
    isLoading,
    error,
    hasData,
    theme,
    shouldRender,
  } = useExpensesPieChartAdapter();

  if (!shouldRender) {
    return null;
  }

  return (
    <ExpensesPieChartView
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
