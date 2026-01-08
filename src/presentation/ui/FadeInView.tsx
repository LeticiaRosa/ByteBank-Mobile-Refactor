/**
 * Presentation Layer - Fade In View
 * Container que gerencia animações de fade in
 */

import { ReactNode } from "react";
import { ViewStyle } from "react-native";
import { useFadeInAdapter } from "../../infrastructure/ui/useAnimationAdapters";
import { FadeInViewView } from "./FadeInViewView";
import {
  ANIMATION_DEFAULTS,
  AnimationDirection,
} from "../../domain/ui/AnimationState";

interface FadeInViewProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  direction?: AnimationDirection;
  style?: ViewStyle;
}

export function FadeInView({
  children,
  delay = ANIMATION_DEFAULTS.FADE_IN.delay,
  duration = ANIMATION_DEFAULTS.FADE_IN.duration,
  direction = ANIMATION_DEFAULTS.FADE_IN.direction,
  style,
}: FadeInViewProps) {
  const animatedStyle = useFadeInAdapter(duration, delay, direction);

  return (
    <FadeInViewView animatedStyle={animatedStyle} style={style}>
      {children}
    </FadeInViewView>
  );
}
