/**
 * Infrastructure Layer - Profile Adapter
 * Combina os adapters de Auth e Theme para criar o estado completo do Profile
 * Segue o princípio de Inversão de Dependência (D do SOLID)
 */

import { useAuthAdapter } from "../auth/useAuthAdapter";
import { useThemeAdapter } from "../theme/useThemeAdapter";
import {
  ProfileState,
  ProfileActions,
  ProfileOption,
} from "../../domain/profile/ProfileState";

/**
 * Adapter que combina Auth e Theme para criar o estado do Profile
 */
export function useProfileAdapter(): ProfileState & ProfileActions {
  const { user, signOut } = useAuthAdapter();
  const { isDark, theme, toggleTheme } = useThemeAdapter();

  // Opções do menu de configurações (apenas dados, sem JSX)
  const profileOptions: ProfileOption[] = [
    {
      title: "Segurança",
      iconName: "shield",
    },
    {
      title: "Notificações",
      iconName: "bell",
    },
    {
      title: "Ajuda",
      iconName: "help-circle",
    },
  ];

  return {
    user,
    isDark,
    theme,
    profileOptions,
    toggleTheme,
    signOut,
  };
}
