/**
 * Infrastructure Layer - Monthly Revenue Chart Adapter
 * Adapter que conecta hooks de dados ao domínio
 */

import { useTheme } from "../../../hooks/useTheme";
import { getTheme } from "../../../styles/theme";
import { useMonthlyBalanceData } from "../../../hooks/useDashboardsCharts";
import {
  ChartData,
  BarDataset,
  ChartConfig,
  CHART_RULES,
} from "../../../domain/home/components";

export interface MonthlyRevenueChartAdapterResult {
  chartData: ChartData<BarDataset>;
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
 * Hook adapter para o gráfico de receitas mensais
 */
export function useMonthlyRevenueChartAdapter(): MonthlyRevenueChartAdapterResult {
  const { isDark } = useTheme();
  const theme = getTheme(isDark);

  const {
    data: monthlyData,
    isLoading,
    error,
  } = useMonthlyBalanceData() || {
    data: undefined,
    isLoading: true,
    error: null,
  };

  // Preparar dados usando regras do domínio
  const hasData = CHART_RULES.hasValidData(monthlyData);

  const chartData: ChartData<BarDataset> = hasData
    ? {
        labels: monthlyData.map((item) =>
          CHART_RULES.formatMonthLabel(item.month_label)
        ),
        datasets: [
          {
            data: monthlyData.map((item) => Number(item.receitas)),
            color: (opacity = 1) => theme.primary,
          },
        ],
      }
    : {
        labels: CHART_RULES.createEmptyLabels(),
        datasets: [
          {
            data: CHART_RULES.createEmptyDataset(),
            color: (opacity = 1) => theme.primary,
          },
        ],
      };

  const chartConfig: ChartConfig = {
    backgroundColor: theme.card,
    backgroundGradientFrom: theme.card,
    backgroundGradientTo: theme.card,
    decimalPlaces: 0,
    color: (opacity = 1) => theme.primary,
    labelColor: (opacity = 1) => theme.foreground,
    style: {
      borderRadius: 12,
    },
    propsForBackgroundLines: {
      strokeDasharray: "3,3",
      stroke: theme.border,
      strokeOpacity: 0.3,
    },
  };

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
    shouldRender: !isLoading && !!monthlyData,
  };
}
