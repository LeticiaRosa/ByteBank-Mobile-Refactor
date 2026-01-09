/**
 * Presentation Layer - Balance Chart View
 * Componente de apresentação puro (stateless)
 * Responsável apenas pela renderização do gráfico
 */

import { View, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { CustomText } from "../../ui/Text";

const screenWidth = Dimensions.get("window").width;

interface BalanceChartViewProps {
  chartData: {
    labels: string[];
    datasets: Array<{
      data: number[];
      color: (opacity?: number) => string;
      strokeWidth: number;
    }>;
  };
  chartConfig: any;
  isLoading: boolean;
  error: any;
  hasData: boolean;
  cardBackgroundColor: string;
  borderColor: string;
}

export function BalanceChartView({
  chartData,
  chartConfig,
  isLoading,
  error,
  hasData,
  cardBackgroundColor,
  borderColor,
}: BalanceChartViewProps) {
  return (
    <View
      style={{
        backgroundColor: cardBackgroundColor,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: borderColor,
      }}
    >
      <CustomText className="text-lg font-semibold text-card-foreground mb-4">
        Evolução do Saldo de {new Date().getFullYear()}
      </CustomText>

      {isLoading ? (
        <CustomText className="text-muted-foreground text-center py-8">
          Carregando dados...
        </CustomText>
      ) : error ? (
        <CustomText className="text-red-500 text-center py-8">
          Erro ao carregar dados
        </CustomText>
      ) : !hasData ? (
        <CustomText className="text-muted-foreground text-center py-8">
          Nenhum dado disponível
        </CustomText>
      ) : (
        <LineChart
          data={chartData}
          width={screenWidth - 64}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={{
            borderRadius: 8,
          }}
          withDots={true}
          withShadow={false}
          withVerticalLabels={true}
          withHorizontalLabels={true}
          formatYLabel={(value) => `R$ ${(Number(value) / 1000).toFixed(0)}k`}
        />
      )}
    </View>
  );
}
