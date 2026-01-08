/**
 * Presentation Layer - Page Transition (View)
 * Componente visual puro para transições de página
 */

import { ReactNode } from "react";
import { Animated } from "react-native";

interface PageTransitionViewProps {
  children: ReactNode;
  animatedStyle: {
    opacity: Animated.Value | number;
    transform?: any[];
  };
}

export function PageTransitionView({
  children,
  animatedStyle,
}: PageTransitionViewProps) {
  return (
    <Animated.View style={[{ flex: 1 }, animatedStyle]}>
      {children}
    </Animated.View>
  );
}
