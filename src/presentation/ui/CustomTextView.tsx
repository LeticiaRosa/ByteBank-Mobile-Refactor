/**
 * Presentation Layer - Custom Text (View)
 * Componente visual puro para texto customizado
 */

import { Text } from "react-native";
import { ReactNode } from "react";

interface CustomTextViewProps {
  children: ReactNode;
  className: string;
}

export function CustomTextView({ children, className }: CustomTextViewProps) {
  return <Text className={className}>{children}</Text>;
}
