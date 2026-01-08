/**
 * Presentation Layer - Animated Scroll View
 * Container que gerencia animações de scroll
 */

import { useScrollAnimationAdapter } from "../../infrastructure/ui/useAnimationAdapters";
import { AnimatedScrollViewView } from "./AnimatedScrollViewView";
import { ScrollViewProps } from "react-native";

interface AnimatedScrollViewProps extends ScrollViewProps {
  children: React.ReactNode;
  enableParallax?: boolean;
  parallaxFactor?: number;
}

export function AnimatedScrollView({
  children,
  enableParallax = false,
  parallaxFactor = 0.5,
  ...props
}: AnimatedScrollViewProps) {
  const { handleScroll } = useScrollAnimationAdapter(
    enableParallax,
    parallaxFactor
  );

  return (
    <AnimatedScrollViewView
      onScroll={handleScroll}
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
      {...props}
    >
      {children}
    </AnimatedScrollViewView>
  );
}
