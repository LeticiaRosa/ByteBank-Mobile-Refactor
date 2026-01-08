/**
 * Domain Layer - Chart State
 * Define tipos e interfaces comuns para componentes de gráficos
 */

/**
 * Dados básicos de um gráfico
 */
export interface ChartData<T = any> {
  labels: string[];
  datasets: T[];
}

/**
 * Dataset para gráfico de linha
 */
export interface LineDataset {
  data: number[];
  color: (opacity?: number) => string;
  strokeWidth: number;
}

/**
 * Dataset para gráfico de barras
 */
export interface BarDataset {
  data: number[];
  color: (opacity?: number) => string;
}

/**
 * Item do gráfico de pizza
 */
export interface PieChartItem {
  name: string;
  population: number;
  color: string;
  legendFontColor: string;
  legendFontSize: number;
}

/**
 * Configuração genérica de gráfico
 */
export interface ChartConfig {
  backgroundColor: string;
  backgroundGradientFrom: string;
  backgroundGradientTo: string;
  decimalPlaces?: number;
  color: (opacity?: number) => string;
  labelColor: (opacity?: number) => string;
  style: {
    borderRadius: number;
  };
  propsForDots?: {
    r: string;
    strokeWidth: string;
    stroke: string;
    fill: string;
  };
  propsForBackgroundLines?: {
    strokeDasharray: string;
    stroke: string;
    strokeOpacity: number;
  };
}

/**
 * Estado comum dos componentes de gráfico
 */
export interface ChartComponentState<T> {
  data: T | undefined;
  isLoading: boolean;
  error: any;
  hasData: boolean;
}

/**
 * Props da view de gráfico
 */
export interface ChartViewProps<T> {
  chartData: T;
  chartConfig: ChartConfig;
  isLoading: boolean;
  error: any;
  hasData: boolean;
  cardBackgroundColor: string;
  borderColor: string;
}

/**
 * Configuração de dimensões de gráfico
 */
export interface ChartDimensions {
  width: number;
  height: number;
  padding?: number;
}

/**
 * Regras de negócio comuns para gráficos
 */
export const CHART_RULES = {
  /**
   * Verifica se há dados suficientes para exibir o gráfico
   */
  hasValidData: <T extends any[]>(data: T | undefined): data is T => {
    return data !== undefined && data.length > 0;
  },

  /**
   * Formata rótulo de mês (ex: "Janeiro 2026" -> "Jan")
   */
  formatMonthLabel: (label: string): string => {
    return label.split(" ")[0];
  },

  /**
   * Cria dataset vazio para fallback
   */
  createEmptyDataset: (length: number = 6): number[] => {
    return Array(length).fill(0);
  },

  /**
   * Cria labels vazios para fallback
   */
  createEmptyLabels: (): string[] => {
    return ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"];
  },
} as const;
