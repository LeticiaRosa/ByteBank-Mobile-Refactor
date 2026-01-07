/**
 * Infrastructure Layer - Auth Adapter
 * Adapta o hook useAuth existente para a camada de apresentação
 * Isola a implementação técnica do Supabase da camada de apresentação
 */

import { useAuth } from "../../hooks/useAuth";
import { AuthState, AuthStatus, User } from "../../domain/auth/AuthState";

export interface AuthAdapter {
  user?: User | null;
  authState: AuthState;
  authStatus: AuthStatus;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName?: string) => Promise<void>;
  signOut: () => Promise<void>;
}

/**
 * Hook adapter que conecta o useAuth original à arquitetura limpa
 */
export function useAuthAdapter(): AuthAdapter {
  const { user, loading, error, signIn, signUp, signOut } = useAuth();

  // Mapeia o usuário do Supabase para o domínio
  const domainUser: User | null = user
    ? {
        id: user.id,
        email: user.email || "",
        fullName: user.user_metadata?.full_name,
      }
    : null;

  // Determina o status de autenticação
  const authStatus: AuthStatus = loading
    ? "loading"
    : user
    ? "authenticated"
    : "unauthenticated";

  const authState: AuthState = {
    user: domainUser,
    loading,
    error: error as Error | null,
  };

  return {
    user,
    authState,
    authStatus,
    signIn: async (email: string, password: string) => {
      await signIn(email, password);
    },
    signUp: async (email: string, password: string, fullName?: string) => {
      await signUp(email, password, fullName);
    },
    signOut: async () => {
      await signOut();
    },
  };
}
