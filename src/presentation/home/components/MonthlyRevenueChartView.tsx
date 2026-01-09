/**
 * Presentation Layer - Monthly Revenue Chart View
 * Componente de apresentação puro (stateless)
 * Responsável apenas pela renderização do gráfico de barras
 */

import { View, Dimensions, ScrollView } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { CustomText } from "../../ui/Text";

const screenWidth = Dimensions.get("window").width;

interface MonthlyRevenueChartViewProps {
  chartData: {
    labels: string[];
    datasets: Array<{
      data: number[];
      color: (opacity?: number) => string;
    }>;
  };
  chartConfig: any;
  isLoading: boolean;
  error: any;
  hasData: boolean;
  cardBackgroundColor: string;
  borderColor: string;
}

export function MonthlyRevenueChartView({
  chartData,
  chartConfig,
  isLoading,
  error,
  hasData,
  cardBackgroundColor,
  borderColor,
}: MonthlyRevenueChartViewProps) {
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
        Receitas de {new Date().getFullYear()}
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
          Nenhuma receita encontrada
        </CustomText>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <BarChart
            data={chartData}
            width={screenWidth - 64}
            height={220}
            chartConfig={chartConfig}
            yAxisLabel="R$ "
            yAxisSuffix=""
            style={{
              borderRadius: 8,
            }}
            verticalLabelRotation={0}
            showValuesOnTopOfBars={true}
            fromZero={true}
          />
        </ScrollView>
      )}
    </View>
  );
}
