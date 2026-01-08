/**
 * Infrastructure Layer - Text Adapters
 *
 * Adapta lógica de processamento de texto
 */

import { TEXT_RULES, TEXT_DEFAULTS } from "../../domain/ui/TextState";

// ============= TEXT CLASSES ADAPTER =============

export function useTextClassesAdapter(customClasses?: string) {
  const classes = TEXT_RULES.combineClasses(
    TEXT_DEFAULTS.BASE_CLASSES,
    customClasses
  );

  return {
    className: classes,
  };
}
