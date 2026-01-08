/**
 * Presentation Layer - Monthly Revenue Chart Container
 * Container com lógica de dados e configuração
 * Delega renderização para MonthlyRevenueChartView
 */

import { useTheme } from "../../../hooks/useTheme";
import { getTheme } from "../../../styles/theme";
import { useMonthlyBalanceData } from "../../../hooks/useDashboardsCharts";
import { MonthlyRevenueChartView } from "./MonthlyRevenueChartView";

export function MonthlyRevenueChart() {
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

  if (isLoading || !monthlyData) {
    return null;
  }

  // Preparar dados para o gráfico de barras
  const chartData =
    monthlyData && monthlyData.length
      ? {
          labels: monthlyData.map((item) => item.month_label.split(" ")[0]),
          datasets: [
            {
              data: monthlyData.map((item) => Number(item.receitas)),
              color: (opacity = 1) => theme.primary,
            },
          ],
        }
      : {
          labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
          datasets: [
            {
              data: [0, 0, 0, 0, 0, 0],
              color: (opacity = 1) => theme.primary,
            },
          ],
        };

  const chartConfig = {
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

  const hasData = monthlyData && monthlyData.length > 0;

  return (
    <MonthlyRevenueChartView
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
