/**
 * Domain Layer - Auth State
 * Define os tipos e interfaces do domínio de autenticação
 * Camada independente de frameworks e bibliotecas
 */

export interface User {
  id: string;
  email: string;
  fullName?: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: Error | null;
}

export type AuthStatus = "authenticated" | "unauthenticated" | "loading";
