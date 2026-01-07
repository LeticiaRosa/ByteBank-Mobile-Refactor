/**
 * Domain Layer - Sidebar/Navigation State
 * Define os tipos e interfaces do domínio de navegação
 * Camada independente de frameworks e bibliotecas
 */

export interface NavigationScreen {
  name: string;
  component: React.ComponentType<any>;
  icon: React.ComponentType<{ color?: string; size?: number }>;
}

export interface SidebarConfig {
  drawerWidth: number;
  showProfileButton: boolean;
}

export interface SidebarTheme {
  isDark: boolean;
  mainColor: string;
  secondaryColor: string;
  accentColor: string;
  inactiveTintColor: string;
  activeTintColor: string;
  activeBackgroundColor: string;
  labelColor: string;
}

export interface SidebarActions {
  navigateToProfile: () => void;
  navigateToScreen: (screenName: string) => void;
}
