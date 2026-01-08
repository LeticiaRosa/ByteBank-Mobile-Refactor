/**
 * Presentation Layer - Expenses Pie Chart Container
 * Container com lógica de dados e configuração
 * Delega renderização para ExpensesPieChartView
 */

import { useTheme } from "../../../hooks/useTheme";
import { getTheme, getChartPieColors } from "../../../styles/theme";
import { useExpensesByCategory } from "../../../hooks/useDashboardsCharts";
import { ExpensesPieChartView } from "./ExpensesPieChartView";

export function ExpensesPieChart() {
  const { isDark } = useTheme();
  const theme = getTheme(isDark);
  const chartColors = getChartPieColors(isDark);

  const {
    data: expensesData,
    isLoading,
    error,
  } = useExpensesByCategory() || {
    data: undefined,
    isLoading: true,
    error: null,
  };

  if (isLoading || !expensesData) {
    return null;
  }

  // Preparar dados para o gráfico de pizza (5 maiores categorias + outras)
  const chartData =
    expensesData && expensesData.length
      ? (() => {
          // Ordenar por valor (maior para menor)
          const sortedExpenses = [...expensesData].sort(
            (a, b) => b.value - a.value
          );

          // Pegar as 5 maiores categorias
          const top5Categories = sortedExpenses.slice(0, 5);

          // Calcular o valor das categorias restantes
          const otherCategoriesValue = sortedExpenses
            .slice(5)
            .reduce((sum, expense) => sum + expense.value, 0);

          // Criar dados do gráfico
          const chartItems = top5Categories.map((expense, index) => {
            const valueInReais = expense.value / 100;
            return {
              name: `${expense.label}`,
              population: valueInReais,
              color: chartColors[index % chartColors.length],
              legendFontColor: theme.foreground,
              legendFontSize: 12,
            };
          });

          // Adicionar categoria "Outras" se houver categorias restantes
          if (otherCategoriesValue > 0) {
            chartItems.push({
              name: "Outras",
              population: otherCategoriesValue / 100,
              color: chartColors[5 % chartColors.length],
              legendFontColor: theme.foreground,
              legendFontSize: 12,
            });
          }

          return chartItems;
        })()
      : [];

  const chartConfig = {
    color: (opacity = 1) => theme.foreground,
    labelColor: (opacity = 1) => theme.foreground,
    style: {
      borderRadius: 12,
    },
  };

  const hasData = chartData.length > 0;

  return (
    <ExpensesPieChartView
      chartData={chartData}
      chartConfig={chartConfig}
      isLoading={isLoading}
      error={error}
      hasData={hasData}
      cardBackgroundColor={theme.card}
      borderColor={theme.border}
    />
  );
}
