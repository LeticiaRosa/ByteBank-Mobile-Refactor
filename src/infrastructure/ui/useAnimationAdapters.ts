/**
 * Infrastructure Layer - Animation Adapters
 *
 * Adapta hooks do React Native Animated para o domínio
 */

import { useRef, useEffect, useState } from "react";
import { Animated, Dimensions } from "react-native";
import {
  ANIMATION_RULES,
  ANIMATION_DEFAULTS,
  AnimationDirection,
  TransitionType,
  AxisDirection,
} from "../../domain/ui/AnimationState";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// ============= FADE IN ADAPTER =============

export function useFadeInAdapter(
  duration: number = ANIMATION_DEFAULTS.FADE_IN.duration,
  delay: number = ANIMATION_DEFAULTS.FADE_IN.delay,
  direction: AnimationDirection = ANIMATION_DEFAULTS.FADE_IN.direction
) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateAnim = useRef(
    new Animated.Value(ANIMATION_RULES.getInitialTranslate(direction))
  ).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(translateAnim, {
          toValue: 0,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration,
          useNativeDriver: true,
        }),
      ]).start();
    }, delay);

    return () => clearTimeout(timer);
  }, [fadeAnim, translateAnim, scaleAnim, delay, duration]);

  const transformProperty = ANIMATION_RULES.getTransformProperty(direction);

  return {
    opacity: fadeAnim,
    transform: [
      transformProperty === "translateY"
        ? { translateY: translateAnim }
        : { translateX: translateAnim },
      { scale: scaleAnim },
    ],
  };
}

// ============= SCROLL ANIMATION ADAPTER =============

export function useScrollAnimationAdapter(
  enableParallax: boolean = ANIMATION_DEFAULTS.PARALLAX.enabled,
  parallaxFactor: number = ANIMATION_DEFAULTS.PARALLAX.factor
) {
  const scrollY = useRef(new Animated.Value(0)).current;
  const fadeHeaderAnim = useRef(new Animated.Value(1)).current;

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false,
      listener: (event: any) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        const headerOpacity = ANIMATION_RULES.calculateHeaderOpacity(offsetY);
        fadeHeaderAnim.setValue(headerOpacity);
      },
    }
  );

  return {
    scrollY,
    fadeHeaderAnim,
    handleScroll,
  };
}

// ============= PARALLAX ADAPTER =============

export function useParallaxAdapter(
  scrollY: Animated.Value,
  factor: number = ANIMATION_DEFAULTS.PARALLAX.factor
) {
  return {
    transform: [
      {
        translateY: scrollY.interpolate({
          inputRange: [0, 300],
          outputRange: [
            0,
            ANIMATION_RULES.calculateParallaxOffset(300, 300, factor),
          ],
          extrapolate: "clamp",
        }),
      },
    ],
  };
}

// ============= SCROLL FADE ADAPTER =============

export function useScrollFadeAdapter(
  scrollY: Animated.Value,
  threshold: number = ANIMATION_DEFAULTS.SCROLL_FADE.threshold
) {
  return {
    opacity: scrollY.interpolate({
      inputRange: [0, threshold],
      outputRange: [1, 0],
      extrapolate: "clamp",
    }),
  };
}

// ============= PAGE TRANSITION ADAPTER =============

export function usePageTransitionAdapter(
  isVisible: boolean,
  transitionType: TransitionType = ANIMATION_DEFAULTS.PAGE_TRANSITION.type,
  direction: AxisDirection = ANIMATION_DEFAULTS.PAGE_TRANSITION.direction,
  duration: number = ANIMATION_DEFAULTS.PAGE_TRANSITION.duration
) {
  const fadeAnim = useRef(new Animated.Value(isVisible ? 1 : 0)).current;
  const slideAnim = useRef(
    new Animated.Value(
      isVisible ? 0 : direction === "horizontal" ? screenWidth : screenHeight
    )
  ).current;
  const scaleAnim = useRef(new Animated.Value(isVisible ? 1 : 0.8)).current;

  useEffect(() => {
    if (isVisible) {
      // Animação de entrada
      const animations = [];

      if (transitionType === "fade" || transitionType === "scale") {
        animations.push(
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration,
            useNativeDriver: true,
          })
        );
      }

      if (transitionType === "slide") {
        animations.push(
          Animated.timing(slideAnim, {
            toValue: 0,
            duration,
            useNativeDriver: true,
          })
        );
      }

      if (transitionType === "scale") {
        animations.push(
          Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 100,
            friction: 8,
            useNativeDriver: true,
          })
        );
      }

      Animated.parallel(animations).start();
    } else {
      // Animação de saída
      const animations = [];

      if (transitionType === "fade" || transitionType === "scale") {
        animations.push(
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: duration * 0.8,
            useNativeDriver: true,
          })
        );
      }

      if (transitionType === "slide") {
        animations.push(
          Animated.timing(slideAnim, {
            toValue: direction === "horizontal" ? -screenWidth : -screenHeight,
            duration: duration * 0.8,
            useNativeDriver: true,
          })
        );
      }

      if (transitionType === "scale") {
        animations.push(
          Animated.timing(scaleAnim, {
            toValue: 0.8,
            duration: duration * 0.8,
            useNativeDriver: true,
          })
        );
      }

      Animated.parallel(animations).start();
    }
  }, [
    isVisible,
    fadeAnim,
    slideAnim,
    scaleAnim,
    transitionType,
    direction,
    duration,
  ]);

  const getAnimatedStyle = () => {
    const transform = [];

    if (transitionType === "slide") {
      if (direction === "horizontal") {
        transform.push({ translateX: slideAnim });
      } else {
        transform.push({ translateY: slideAnim });
      }
    }

    if (transitionType === "scale") {
      transform.push({ scale: scaleAnim });
    }

    return {
      opacity:
        transitionType === "fade" || transitionType === "scale" ? fadeAnim : 1,
      transform: transform.length > 0 ? transform : undefined,
    };
  };

  return getAnimatedStyle();
}

// ============= SKELETON ANIMATION ADAPTER =============

export function useSkeletonAnimationAdapter() {
  const pulseAnim = useRef(
    new Animated.Value(ANIMATION_DEFAULTS.SKELETON.minOpacity)
  ).current;

  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: ANIMATION_DEFAULTS.SKELETON.maxOpacity,
          duration: ANIMATION_DEFAULTS.SKELETON.duration,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: ANIMATION_DEFAULTS.SKELETON.minOpacity,
          duration: ANIMATION_DEFAULTS.SKELETON.duration,
          useNativeDriver: true,
        }),
      ])
    );

    pulseAnimation.start();

    return () => pulseAnimation.stop();
  }, [pulseAnim]);

  return { opacity: pulseAnim };
}

// ============= SECTION TRANSITION ADAPTER =============

export function useSectionTransitionAdapter(
  sections: string[],
  initialSection: string = sections[0]
) {
  const [currentSection, setCurrentSection] = useState(initialSection);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const transitionTo = (section: string) => {
    if (
      sections.includes(section) &&
      section !== currentSection &&
      !isTransitioning
    ) {
      setIsTransitioning(true);

      setTimeout(() => {
        setCurrentSection(section);
        setIsTransitioning(false);
      }, 150);
    }
  };

  return {
    currentSection,
    isTransitioning,
    transitionTo,
    isCurrentSection: (section: string) => section === currentSection,
  };
}
