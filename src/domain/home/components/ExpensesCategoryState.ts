/**
 * Domain Layer - Expenses Category State
 * Define tipos e regras de negócio para gastos por categoria
 */

import { PieChartItem } from "./ChartState";

/**
 * Categoria de gasto
 */
export interface ExpenseCategory {
  label: string;
  value: number; // Valor em centavos
}

/**
 * Estado do componente de gastos por categoria
 */
export interface ExpensesCategoryState {
  expenses: ExpenseCategory[];
  chartItems: PieChartItem[];
  topCategories: ExpenseCategory[];
  othersValue: number;
}

/**
 * Regras de negócio para gastos por categoria
 */
export const EXPENSES_CATEGORY_RULES: {
  readonly MAX_CATEGORIES: number;
  readonly OTHERS_CATEGORY_NAME: string;
  centavosToReais: (centavos: number) => number;
  sortByValue: (expenses: ExpenseCategory[]) => ExpenseCategory[];
  getTopCategories: (
    expenses: ExpenseCategory[],
    count?: number
  ) => ExpenseCategory[];
  calculateOthersValue: (expenses: ExpenseCategory[], count?: number) => number;
  createChartItem: (
    expense: ExpenseCategory,
    color: string,
    legendFontColor: string
  ) => PieChartItem;
  createOthersItem: (
    value: number,
    color: string,
    legendFontColor: string
  ) => PieChartItem;
  processExpenses: (
    expenses: ExpenseCategory[],
    colors: readonly string[],
    legendFontColor: string
  ) => PieChartItem[];
} = {
  /**
   * Número máximo de categorias a serem exibidas
   */
  MAX_CATEGORIES: 5,

  /**
   * Nome da categoria "Outras"
   */
  OTHERS_CATEGORY_NAME: "Outras",

  /**
   * Converte valor de centavos para reais
   */
  centavosToReais: (centavos: number): number => {
    return centavos / 100;
  },

  /**
   * Ordena categorias por valor (maior para menor)
   */
  sortByValue: (expenses: ExpenseCategory[]): ExpenseCategory[] => {
    return [...expenses].sort((a, b) => b.value - a.value);
  },

  /**
   * Pega as N maiores categorias
   */
  getTopCategories: (
    expenses: ExpenseCategory[],
    count: number = EXPENSES_CATEGORY_RULES.MAX_CATEGORIES
  ): ExpenseCategory[] => {
    const sorted = EXPENSES_CATEGORY_RULES.sortByValue(expenses);
    return sorted.slice(0, count);
  },

  /**
   * Calcula o valor total das categorias restantes
   */
  calculateOthersValue: (
    expenses: ExpenseCategory[],
    count: number = EXPENSES_CATEGORY_RULES.MAX_CATEGORIES
  ): number => {
    const sorted = EXPENSES_CATEGORY_RULES.sortByValue(expenses);
    return sorted
      .slice(count)
      .reduce(
        (sum: number, expense: ExpenseCategory) => sum + expense.value,
        0
      );
  },

  /**
   * Cria item do gráfico de pizza a partir de uma categoria
   */
  createChartItem: (
    expense: ExpenseCategory,
    color: string,
    legendFontColor: string
  ): PieChartItem => {
    return {
      name: expense.label,
      population: EXPENSES_CATEGORY_RULES.centavosToReais(expense.value),
      color,
      legendFontColor,
      legendFontSize: 12,
    };
  },

  /**
   * Cria item "Outras" para o gráfico
   */
  createOthersItem: (
    value: number,
    color: string,
    legendFontColor: string
  ): PieChartItem => {
    return {
      name: EXPENSES_CATEGORY_RULES.OTHERS_CATEGORY_NAME,
      population: EXPENSES_CATEGORY_RULES.centavosToReais(value),
      color,
      legendFontColor,
      legendFontSize: 12,
    };
  },

  /**
   * Processa categorias de gasto para o gráfico
   */
  processExpenses: (
    expenses: ExpenseCategory[],
    colors: readonly string[],
    legendFontColor: string
  ): PieChartItem[] => {
    if (!expenses || expenses.length === 0) {
      return [];
    }

    const topCategories = EXPENSES_CATEGORY_RULES.getTopCategories(expenses);
    const othersValue = EXPENSES_CATEGORY_RULES.calculateOthersValue(expenses);

    const chartItems = topCategories.map(
      (expense: ExpenseCategory, index: number) =>
        EXPENSES_CATEGORY_RULES.createChartItem(
          expense,
          colors[index % colors.length],
          legendFontColor
        )
    );

    if (othersValue > 0) {
      chartItems.push(
        EXPENSES_CATEGORY_RULES.createOthersItem(
          othersValue,
          colors[EXPENSES_CATEGORY_RULES.MAX_CATEGORIES % colors.length],
          legendFontColor
        )
      );
    }

    return chartItems;
  },
} as const;
