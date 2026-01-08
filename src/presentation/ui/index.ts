/**
 * Barrel exports - Presentation UI Layer
 */

export { AnimatedScrollView } from "./AnimatedScrollView";
export { FadeInView } from "./FadeInView";
export { PageTransition } from "./PageTransition";
export { ConfirmDeleteModal } from "./ConfirmDeleteModal";
export { CustomText } from "./Text";
export { toastConfig } from "./ToastConfig";

// Re-export hooks de animação da infraestrutura para uso externo
export {
  useParallaxAdapter as useParallaxEffect,
  useScrollFadeAdapter as useScrollFade,
  useSkeletonAnimationAdapter as useSkeletonAnimation,
  useSectionTransitionAdapter as useSectionTransition,
} from "../../infrastructure/ui/useAnimationAdapters";
