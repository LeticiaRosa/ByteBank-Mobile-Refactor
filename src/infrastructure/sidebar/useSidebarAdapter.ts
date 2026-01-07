/**
 * Infrastructure Layer - Sidebar Adapter
 * Adapta hooks existentes (useTheme, useNavigation) para a camada de apresentação
 * Isola implementações técnicas da camada de apresentação
 */

import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../hooks/useTheme";
import { getThemeColors } from "../../styles/theme";
import {
  SidebarTheme,
  SidebarActions,
} from "../../domain/sidebar/SidebarState";

export interface SidebarAdapter {
  theme: SidebarTheme;
  actions: SidebarActions;
}

/**
 * Hook adapter que conecta os hooks originais à arquitetura limpa
 */
export function useSidebarAdapter(): SidebarAdapter {
  const { isDark } = useTheme();
  const navigation = useNavigation();

  // Obtém cores do tema
  const themeColors = getThemeColors(isDark);

  const theme: SidebarTheme = {
    isDark,
    mainColor: themeColors.primary,
    secondaryColor: themeColors.secondary,
    accentColor: themeColors.sidebar,
    inactiveTintColor: themeColors.sidebarForeground,
    activeTintColor: themeColors.sidebarForeground,
    activeBackgroundColor: themeColors.secondary,
    labelColor: themeColors.sidebarForeground,
  };

  const actions: SidebarActions = {
    navigateToProfile: () => {
      navigation.navigate("Perfil" as never);
    },
    navigateToScreen: (screenName: string) => {
      navigation.navigate(screenName as never);
    },
  };

  return {
    theme,
    actions,
  };
}
