/**
 * Presentation Layer - Home View
 *
 * Componente visual stateless que renderiza o dashboard principal.
 * Segue o princípio de Responsabilidade Única (S do SOLID).
 */

import { View, ScrollView, Animated, StyleSheet } from "react-native";
import { Wallet, TrendingDown, TrendingUp } from "lucide-react-native";
import { useTheme } from "../../hooks/useTheme";
import { getTheme, colors } from "../../styles/theme";
import { MoneyUtils } from "../../utils";
import {
  AccountInfos,
  BalanceChart,
  ExpensesPieChart,
  MonthlyRevenueChart,
} from "./components";
import type { HomeState, HomeActions } from "../../domain/home/HomeState";

interface HomeViewProps {
  state: HomeState;
  actions: HomeActions;
  getAnimatedStyle: (index: number) => any;
}

export function HomeView({ state, actions, getAnimatedStyle }: HomeViewProps) {
  const { isDark } = useTheme();
  const theme = getTheme(isDark);

  const iconColor = theme.primary;
  const successColor = colors.charts.main.green;
  const destructiveColor = theme.destructive;
  const backgroundColor = theme.background;

  // Componente wrapper animado
  const AnimatedSection = ({
    index,
    children,
  }: {
    index: number;
    children: React.ReactNode;
  }) => (
    <Animated.View style={getAnimatedStyle(index)}>{children}</Animated.View>
  );

  if (state.isLoadingRealtimeBalance || state.isLoadingFinancialSummary) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.cardsContainer}>
          {/* Saldo Disponível */}
          <AnimatedSection index={0}>
            <AccountInfos
              title="Saldo Disponível"
              amount={state.realtimeBalance}
              isLoadingAccounts={state.isLoadingRealtimeBalance}
              formatType="currency"
              colorType="primary"
              icon={<Wallet size={24} color={iconColor} />}
              isRealtimeConnected={state.isRealtimeConnected}
            />
          </AnimatedSection>

          {/* Receitas do Mês */}
          <AnimatedSection index={2}>
            <AccountInfos
              title="Receitas do Mês"
              text={`${state.expensesGrowth} vs mês anterior`}
              isLoadingAccounts={state.isLoadingFinancialSummary}
              amount={MoneyUtils.centsToReais(state.monthlyRevenue)}
              colorType="success"
              formatType="currency"
              showeye={false}
              icon={<TrendingUp size={24} color={successColor} />}
            />
          </AnimatedSection>

          {/* Gastos do Mês */}
          <AnimatedSection index={1}>
            <AccountInfos
              title="Gastos do Mês "
              text={`${state.revenueGrowth} vs mês anterior`}
              isLoadingAccounts={state.isLoadingFinancialSummary}
              amount={MoneyUtils.centsToReais(state.monthlyExpenses)}
              showeye={false}
              colorType="destructive"
              formatType="currency"
              icon={<TrendingDown size={24} color={destructiveColor} />}
            />
          </AnimatedSection>

          {/* Gráfico de Pizza - Gastos por Categoria */}
          <AnimatedSection index={3}>
            <ExpensesPieChart />
          </AnimatedSection>

          {/* Gráfico de Linha - Saldo ao Longo do Tempo */}
          <AnimatedSection index={4}>
            <BalanceChart />
          </AnimatedSection>

          {/* Gráfico de Barras - Receitas Mensais */}
          <AnimatedSection index={5}>
            <MonthlyRevenueChart />
          </AnimatedSection>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  cardsContainer: {
    padding: 16,
    gap: 16,
  },
});
