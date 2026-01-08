/**
 * Infrastructure Layer - Toast Adapters
 *
 * Adapta configuração de toasts do react-native-toast-message
 */

import {
  TOAST_RULES,
  TOAST_DEFAULTS,
  ToastType,
} from "../../domain/ui/ToastState";

// ============= TOAST STYLE ADAPTER =============

export function useToastStyleAdapter(type: ToastType) {
  const borderColor = TOAST_RULES.getBorderColor(type);

  return {
    borderLeftColor: borderColor,
    borderLeftWidth: TOAST_DEFAULTS.BORDER_WIDTH,
    backgroundColor: TOAST_DEFAULTS.BACKGROUND_COLOR,
    ...TOAST_DEFAULTS.STYLE,
  };
}

// ============= TOAST TEXT STYLE ADAPTER =============

export function useToastTextStyleAdapter() {
  return {
    text1Style: TOAST_DEFAULTS.TEXT_STYLE.title,
    text2Style: TOAST_DEFAULTS.TEXT_STYLE.message,
    contentContainerStyle: {
      paddingHorizontal: 15,
    },
  };
}
