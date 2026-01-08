/**
 * Domain Layer - Animation States
 *
 * Define tipos e regras de negócio para animações
 */

// ============= TYPES =============

export type AnimationDirection = "up" | "down" | "left" | "right";
export type TransitionType = "slide" | "fade" | "scale";
export type AxisDirection = "horizontal" | "vertical";

export interface AnimationConfig {
  duration: number;
  delay: number;
  direction: AnimationDirection;
}

export interface TransitionConfig {
  type: TransitionType;
  direction: AxisDirection;
  duration: number;
}

export interface ParallaxConfig {
  enabled: boolean;
  factor: number;
}

export interface ScrollAnimationConfig {
  enableParallax: boolean;
  parallaxFactor: number;
  fadeThreshold: number;
}

// ============= BUSINESS RULES =============

export const ANIMATION_RULES = {
  /**
   * Calcula o deslocamento inicial baseado na direção
   */
  getInitialTranslate: (direction: AnimationDirection): number => {
    const OFFSET = 30;
    switch (direction) {
      case "up":
        return OFFSET;
      case "down":
        return -OFFSET;
      case "left":
        return OFFSET;
      case "right":
        return -OFFSET;
      default:
        return OFFSET;
    }
  },

  /**
   * Determina qual propriedade de transformação usar
   */
  getTransformProperty: (
    direction: AnimationDirection
  ): "translateY" | "translateX" => {
    switch (direction) {
      case "up":
      case "down":
        return "translateY";
      case "left":
      case "right":
        return "translateX";
      default:
        return "translateY";
    }
  },

  /**
   * Valida configuração de animação
   */
  validateAnimationConfig: (config: AnimationConfig): boolean => {
    return (
      config.duration > 0 &&
      config.delay >= 0 &&
      ["up", "down", "left", "right"].includes(config.direction)
    );
  },

  /**
   * Valida configuração de transição
   */
  validateTransitionConfig: (config: TransitionConfig): boolean => {
    return (
      config.duration > 0 &&
      ["slide", "fade", "scale"].includes(config.type) &&
      ["horizontal", "vertical"].includes(config.direction)
    );
  },

  /**
   * Calcula opacidade do header baseado no scroll
   */
  calculateHeaderOpacity: (
    scrollOffset: number,
    threshold: number = 50
  ): number => {
    if (scrollOffset > threshold) return 0;
    return 1 - scrollOffset / threshold;
  },

  /**
   * Calcula fator de parallax
   */
  calculateParallaxOffset: (
    scrollY: number,
    maxScroll: number,
    factor: number
  ): number => {
    return Math.min(scrollY * factor, maxScroll * factor);
  },
} as const;

// ============= CONSTANTS =============

export const ANIMATION_DEFAULTS = {
  FADE_IN: {
    duration: 600,
    delay: 0,
    direction: "up" as AnimationDirection,
  },
  PARALLAX: {
    enabled: false,
    factor: 0.5,
  },
  SCROLL_FADE: {
    threshold: 100,
  },
  PAGE_TRANSITION: {
    duration: 300,
    type: "slide" as TransitionType,
    direction: "horizontal" as AxisDirection,
  },
  SKELETON: {
    minOpacity: 0.3,
    maxOpacity: 1,
    duration: 1000,
  },
} as const;
