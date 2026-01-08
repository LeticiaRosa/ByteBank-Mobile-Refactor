/**
 * Infrastructure Layer - Expenses Pie Chart Adapter
 * Adapter que conecta hooks de dados ao domínio
 */

import { useTheme } from "../../../hooks/useTheme";
import { getTheme, getChartPieColors } from "../../../styles/theme";
import { useExpensesByCategory } from "../../../hooks/useDashboardsCharts";
import {
  PieChartItem,
  ChartConfig,
  EXPENSES_CATEGORY_RULES,
} from "../../../domain/home/components";

export interface ExpensesPieChartAdapterResult {
  chartData: PieChartItem[];
  chartConfig: ChartConfig;
  isLoading: boolean;
  error: any;
  hasData: boolean;
  theme: {
    cardBackgroundColor: string;
    borderColor: string;
  };
  shouldRender: boolean;
}

/**
 * Hook adapter para o gráfico de pizza de gastos
 */
export function useExpensesPieChartAdapter(): ExpensesPieChartAdapterResult {
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

  // Processar dados usando regras do domínio
  const chartData =
    expensesData && expensesData.length
      ? EXPENSES_CATEGORY_RULES.processExpenses(
          expensesData,
          chartColors,
          theme.foreground
        )
      : [];

  const chartConfig: ChartConfig = {
    backgroundColor: theme.card,
    backgroundGradientFrom: theme.card,
    backgroundGradientTo: theme.card,
    color: (opacity = 1) => theme.foreground,
    labelColor: (opacity = 1) => theme.foreground,
    style: {
      borderRadius: 12,
    },
  };

  const hasData = chartData.length > 0;

  return {
    chartData,
    chartConfig,
    isLoading,
    error,
    hasData,
    theme: {
      cardBackgroundColor: theme.card,
      borderColor: theme.border,
    },
    shouldRender: !isLoading && !!expensesData,
  };
}
