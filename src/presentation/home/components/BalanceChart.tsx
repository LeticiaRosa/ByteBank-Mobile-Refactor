/**
 * Presentation Layer - Balance Chart Container
 * Container com lógica de dados e configuração
 * Delega renderização para BalanceChartView
 */

import { useTheme } from "../../../hooks/useTheme";
import { getTheme } from "../../../styles/theme";
import { useMonthlyBalanceData } from "../../../hooks/useDashboardsCharts";
import { BalanceChartView } from "./BalanceChartView";

export function BalanceChart() {
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

  // Preparar dados para o gráfico de linha
  if (isLoading || !monthlyData) {
    return null;
  }

  const chartData =
    monthlyData && monthlyData.length
      ? {
          labels: monthlyData.map((item) => item.month_label.split(" ")[0]),
          datasets: [
            {
              data: monthlyData.map((item) => item.saldo),
              color: (opacity = 1) => theme.primary,
              strokeWidth: 3,
            },
          ],
        }
      : {
          labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
          datasets: [
            {
              data: [0, 0, 0, 0, 0, 0],
              color: (opacity = 1) => theme.primary,
              strokeWidth: 3,
            },
          ],
        };

  const chartConfig = {
    backgroundColor: theme.card,
    backgroundGradientFrom: theme.card,
    backgroundGradientTo: theme.card,
    decimalPlaces: 2,
    color: (opacity = 1) => theme.primary,
    labelColor: (opacity = 1) => theme.foreground,
    style: {
      borderRadius: 12,
    },
    propsForDots: {
      r: "4",
      strokeWidth: "2",
      stroke: theme.primary,
      fill: theme.background,
    },
    propsForBackgroundLines: {
      strokeDasharray: "3,3",
      stroke: theme.border,
      strokeOpacity: 0.3,
    },
  };

  const hasData = monthlyData && monthlyData.length > 0;

  return (
    <BalanceChartView
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
