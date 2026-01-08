/**
 * Presentation Layer - Custom Text
 * Container que gerencia classes CSS para texto
 */

import { ReactNode } from "react";
import { useTextClassesAdapter } from "../../infrastructure/ui/useTextAdapters";
import { CustomTextView } from "./CustomTextView";

interface CustomTextProps {
  children: ReactNode;
  className?: string;
}

export function CustomText({ children, className }: CustomTextProps) {
  const { className: combinedClassName } = useTextClassesAdapter(className);

  return (
    <CustomTextView className={combinedClassName}>{children}</CustomTextView>
  );
}
