import { View, ScrollView, Animated } from "react-native";
import { useEffect } from "react";
import { styles } from "./styles";
import { AccountInfos } from "./components/AccountInfos";
import { BalanceChart } from "./components/BalanceChart";
import { ExpensesPieChart } from "./components/ExpensesPieChart";
import { Wallet, TrendingDown, TrendingUp } from "lucide-react-native";
import { useTheme } from "../../../hooks/useTheme";
import { getTheme, colors } from "../../../styles/theme";
import { MonthlyRevenueChart } from "./components/MonthlyRevenueChart";
import { useMonthlyFinancialSummary } from "../../../hooks/useMonthlyFinancialSummary";
import { useStaggeredAnimation } from "../../../hooks/useStaggeredAnimation";
import { useReactiveBalance } from "../../../hooks/useReactiveBalance";
import { MoneyUtils } from "../../../utils";

export function Home() {
  const { isDark } = useTheme();

  // 🚀 Hook de saldo reativo com RxJS + Supabase Realtime
  const {
    balance: realtimeBalance,
    isConnected: isRealtimeConnected,
    isLoading: isLoadingRealtimeBalance,
  } = useReactiveBalance();

  const {
    monthlyRevenue,
    monthlyExpenses,
    revenueGrowth,
    expensesGrowth,
    isLoading: isLoadingFinancialSummary,
  } = useMonthlyFinancialSummary();
  const theme = getTheme(isDark);
  const iconColor = theme.primary;
  const successColor = colors.charts.main.green; // Verde do sistema de charts
  const destructiveColor = theme.destructive; // Vermelho do tema
  const backgroundColor = theme.background;

  // Configurar animações para 6 seções
  const { startAnimations, getAnimatedStyle } = useStaggeredAnimation({
    itemCount: 6,
    duration: 600,
    staggerDelay: 150,
    initialDelay: 200,
  });

  // Iniciar animações quando dados carregarem
  useEffect(() => {
    if (!isLoadingRealtimeBalance && !isLoadingFinancialSummary) {
      startAnimations();
    }
  }, [isLoadingRealtimeBalance, isLoadingFinancialSummary, startAnimations]);

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

  if (isLoadingRealtimeBalance || isLoadingFinancialSummary) {
    return null;
  }

  return (
    <View
      style={[styles.container, { backgroundColor }]}
      className="flex-1 w-full h-full"
    >
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <View style={styles.cardsContainer}>
          <AnimatedSection index={0}>
            <AccountInfos
              title="Saldo Disponível"
              amount={realtimeBalance} // 🚀 Usando saldo reativo em tempo real
              isLoadingAccounts={isLoadingRealtimeBalance}
              formatType="currency"
              colorType="primary"
              icon={<Wallet size={24} color={iconColor} />}
              isRealtimeConnected={isRealtimeConnected} // 🟢 Indicador de conexão real-time
            />
          </AnimatedSection>

          <AnimatedSection index={2}>
            <AccountInfos
              title="Receitas do Mês"
              text={`${expensesGrowth} vs mês anterior`}
              isLoadingAccounts={isLoadingFinancialSummary}
              amount={MoneyUtils.centsToReais(monthlyRevenue)}
              colorType="success"
              formatType="currency"
              showeye={false}
              icon={<TrendingUp size={24} color={successColor} />}
            />
          </AnimatedSection>

          <AnimatedSection index={1}>
            <AccountInfos
              title="Gastos do Mês "
              text={`${revenueGrowth} vs mês anterior`}
              isLoadingAccounts={isLoadingFinancialSummary}
              amount={MoneyUtils.centsToReais(monthlyExpenses)}
              showeye={false}
              colorType="destructive"
              formatType="currency"
              icon={<TrendingDown size={24} color={destructiveColor} />}
            />
          </AnimatedSection>

          <AnimatedSection index={3}>
            <ExpensesPieChart />
          </AnimatedSection>

          <AnimatedSection index={4}>
            <BalanceChart />
          </AnimatedSection>

          <AnimatedSection index={5}>
            <MonthlyRevenueChart />
          </AnimatedSection>
        </View>
      </ScrollView>
    </View>
  );
}
