/**
 * Presentation Layer - Expenses Pie Chart View
 * Componente de apresentação puro (stateless)
 * Responsável apenas pela renderização do gráfico de pizza
 */

import { View, Dimensions } from "react-native";
import { PieChart } from "react-native-chart-kit";
import { CustomText } from "../../ui/Text";
import { FadeInView } from "../../ui/FadeInView";

const screenWidth = Dimensions.get("window").width;

interface ExpensesPieChartViewProps {
  chartData: Array<{
    name: string;
    population: number;
    color: string;
    legendFontColor: string;
    legendFontSize: number;
  }>;
  chartConfig: any;
  isLoading: boolean;
  error: any;
  hasData: boolean;
  cardBackgroundColor: string;
  borderColor: string;
}

export function ExpensesPieChartView({
  chartData,
  chartConfig,
  isLoading,
  error,
  hasData,
  cardBackgroundColor,
  borderColor,
}: ExpensesPieChartViewProps) {
  return (
    <FadeInView delay={300} direction="up" duration={800}>
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
          Gastos por Categoria
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
            Nenhum gasto encontrado
          </CustomText>
        ) : (
          <FadeInView delay={600} direction="up" duration={600}>
            <PieChart
              data={chartData}
              width={screenWidth - 64}
              height={180}
              chartConfig={chartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="0"
              absolute={false}
            />
          </FadeInView>
        )}
      </View>
    </FadeInView>
  );
}
