/**
 * Presentation Layer - Animated Scroll View (View)
 * Componente visual puro para ScrollView animado
 */

import { ScrollView, ScrollViewProps } from "react-native";

interface AnimatedScrollViewViewProps extends ScrollViewProps {
  children: React.ReactNode;
}

export function AnimatedScrollViewView({
  children,
  ...props
}: AnimatedScrollViewViewProps) {
  return <ScrollView {...props}>{children}</ScrollView>;
}
