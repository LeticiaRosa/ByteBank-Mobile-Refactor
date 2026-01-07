/**
 * Infrastructure Layer - Theme Adapter
 * Adapta o hook useTheme para a camada de domínio
 * Segue o princípio de Inversão de Dependência (D do SOLID)
 */

import { useTheme } from "../../hooks/useTheme";
import { Theme } from "../../domain/profile/ProfileState";
import { getTheme } from "../../styles/theme";

/**
 * Adapter que expõe os dados do theme no formato esperado pelo domínio
 */
export function useThemeAdapter() {
  const { isDark, toggleTheme } = useTheme();
  const theme = getTheme(isDark);

  // Adapta o tema para o formato do domínio
  const domainTheme: Theme = {
    primary: theme.primary,
    background: theme.background,
    card: theme.card,
    muted: theme.muted,
    border: theme.border,
  };

  return {
    isDark,
    theme: domainTheme,
    toggleTheme,
  };
}
