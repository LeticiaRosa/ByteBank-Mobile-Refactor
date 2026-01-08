/**
 * Presentation Layer - Authenticated App
 * Container que configura o tema e renderiza a view do app autenticado
 */

import { useTheme } from "../../hooks/useTheme";
import { getTheme } from "../../styles/theme";
import { AuthenticatedAppView } from "./AuthenticatedAppView";

/**
 * Shell principal do aplicativo para usuários autenticados
 *
 * Responsabilidades:
 * - Aplicar tema (dark/light mode)
 * - Configurar navegação principal
 * - Fornecer contexto de safe area e status bar
 */
export function AuthenticatedApp() {
  const { isDark } = useTheme();
  const theme = getTheme(isDark);

  return (
    <AuthenticatedAppView
      backgroundColor={theme.background}
      cardBackgroundColor={theme.card}
      statusBarStyle={isDark ? "dark-content" : "light-content"}
    />
  );
}
