/**
 * Domain Layer - Profile State
 * Define os tipos e interfaces da camada de domínio para Profile
 * Independente de frameworks e implementações técnicas
 */

/**
 * Representa um usuário no domínio
 */
export interface User {
  email?: string;
  user_metadata?: {
    full_name?: string;
  };
}

/**
 * Representa uma opção do menu de configurações
 */
export interface ProfileOption {
  title: string;
  iconName: "shield" | "bell" | "help-circle";
}

/**
 * Representa o tema da aplicação
 */
export interface Theme {
  primary: string;
  background: string;
  card: string;
  muted: string;
  border: string;
}

/**
 * Estado completo do Profile
 */
export interface ProfileState {
  user?: User | null;
  isDark: boolean;
  theme: Theme;
  profileOptions: ProfileOption[];
}

/**
 * Ações disponíveis no Profile
 */
export interface ProfileActions {
  toggleTheme: () => void;
  signOut: () => void;
}
