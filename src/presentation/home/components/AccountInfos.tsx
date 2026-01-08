/**
 * Presentation Layer - Account Infos Container
 * Container com lógica de estado e animações
 * Delega renderização para AccountInfosView
 */

import { useState, useRef } from "react";
import { Animated } from "react-native";
import { useTheme } from "../../../hooks/useTheme";
import { getTheme } from "../../../styles/theme";
import { ReactNode } from "react";
import { useSkeletonAnimation } from "../../../components/ui/FadeInView";
import { AccountInfosView } from "./AccountInfosView";

interface AccountInfosProps {
  title?: string;
  amount: number;
  text?: string;
  isLoadingAccounts: boolean;
  showeye?: boolean;
  colorType?: "primary" | "success" | "destructive";
  formatType?: "currency" | "number";
  icon?: ReactNode;
  isRealtimeConnected?: boolean;
}

export function AccountInfos(props: AccountInfosProps) {
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);

  // Animações para transições suaves
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const { isDark } = useTheme();
  const theme = getTheme(isDark);

  // Estilos do tema
  const cardForegroundColor = theme.cardForeground;
  const cardBackgroundColor = theme.card;
  const iconColor = theme.secondaryForeground;
  const borderColor = theme.border;
  const mutedColor = theme.muted;

  // Hook para animação de skeleton
  const skeletonStyle = useSkeletonAnimation();

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

  const formatValue = (value: number) => {
    if (props.formatType === "number") {
      return value.toLocaleString("pt-BR");
    }

    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const getAmountColorClass = () => {
    switch (props.colorType) {
      case "success":
        return "text-green-600 dark:text-green-400";
      case "destructive":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-primary";
    }
  };

  return (
    <AccountInfosView
      {...props}
      isBalanceVisible={isBalanceVisible}
      onToggleBalance={toggleBalanceVisibility}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      scaleAnim={scaleAnim}
      opacityAnim={opacityAnim}
      skeletonStyle={skeletonStyle}
      cardBackgroundColor={cardBackgroundColor}
      cardForegroundColor={cardForegroundColor}
      iconColor={iconColor}
      borderColor={borderColor}
      mutedColor={mutedColor}
      formatValue={formatValue}
      getAmountColorClass={getAmountColorClass}
    />
  );
}
