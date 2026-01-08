/**
 * Infrastructure Layer - Account Infos Adapter
 * Adapter que conecta hooks, tema e animações ao domínio
 * Isola a implementação técnica da lógica de negócio
 */

import { useState, useRef } from "react";
import { Animated } from "react-native";
import { useTheme } from "../../../hooks/useTheme";
import { getTheme } from "../../../styles/theme";
import { useSkeletonAnimation } from "../../../presentation/ui";
import {
  AccountInfosProps,
  AccountInfosViewState,
  ACCOUNT_INFOS_RULES,
} from "../../../domain/home/components";

/**
 * Hook adapter que gerencia estado e lógica do AccountInfos
 */
export function useAccountInfosAdapter(
  props: AccountInfosProps
): AccountInfosViewState {
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);

  // Animações para transições suaves
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const { isDark } = useTheme();
  const theme = getTheme(isDark);

  // Hook para animação de skeleton
  const skeletonStyle = useSkeletonAnimation();

  // Ações
  const toggleBalanceVisibility = () => {
    // Animação de "piscar" ao alternar visibilidade
    Animated.sequence([
      Animated.timing(opacityAnim, {
        toValue: 0.3,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    setIsBalanceVisible(!isBalanceVisible);
  };

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  // Utilitários usando regras do domínio
  const formatValue = (value: number) => {
    return ACCOUNT_INFOS_RULES.formatValue(
      value,
      props.formatType || "currency"
    );
  };

  const getAmountColorClass = () => {
    return ACCOUNT_INFOS_RULES.getColorClass(props.colorType || "primary");
  };

  return {
    ...props,
    isBalanceVisible,
    scaleAnim,
    opacityAnim,
    skeletonStyle,
    theme: {
      cardForegroundColor: theme.cardForeground,
      cardBackgroundColor: theme.card,
      iconColor: theme.secondaryForeground,
      borderColor: theme.border,
      mutedColor: theme.muted,
    },
    toggleBalanceVisibility,
    handlePressIn,
    handlePressOut,
    formatValue,
    getAmountColorClass,
  };
}
