/**
 * Presentation Layer - Page Transition
 * Container que gerencia transições de página
 */

import { ReactNode } from "react";
import { usePageTransitionAdapter } from "../../infrastructure/ui/useAnimationAdapters";
import { PageTransitionView } from "./PageTransitionView";
import {
  ANIMATION_DEFAULTS,
  TransitionType,
  AxisDirection,
} from "../../domain/ui/AnimationState";

interface PageTransitionProps {
  children: ReactNode;
  isVisible: boolean;
  transitionType?: TransitionType;
  direction?: AxisDirection;
  duration?: number;
}

export function PageTransition({
  children,
  isVisible,
  transitionType = ANIMATION_DEFAULTS.PAGE_TRANSITION.type,
  direction = ANIMATION_DEFAULTS.PAGE_TRANSITION.direction,
  duration = ANIMATION_DEFAULTS.PAGE_TRANSITION.duration,
}: PageTransitionProps) {
  const animatedStyle = usePageTransitionAdapter(
    isVisible,
    transitionType,
    direction,
    duration
  );

  return (
    <PageTransitionView animatedStyle={animatedStyle}>
      {children}
    </PageTransitionView>
  );
}
