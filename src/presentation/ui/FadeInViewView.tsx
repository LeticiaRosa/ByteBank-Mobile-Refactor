/**
 * Presentation Layer - Fade In View (View)
 * Componente visual puro para fade in
 */

import { ReactNode } from "react";
import { Animated, ViewStyle } from "react-native";

interface FadeInViewViewProps {
  children: ReactNode;
  animatedStyle: {
    opacity: Animated.Value;
    transform: any[];
  };
  style?: ViewStyle;
}

export function FadeInViewView({
  children,
  animatedStyle,
  style,
}: FadeInViewViewProps) {
  return (
    <Animated.View
      style={[
        {
          opacity: animatedStyle.opacity,
          transform: animatedStyle.transform,
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
}
