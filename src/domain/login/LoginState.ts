/**
 * Domain Layer - Login State
 * Define os tipos e interfaces do domínio de login/cadastro
 * Camada independente de frameworks e bibliotecas
 */

export type LoginMode = "login" | "signup";

export interface LoginFormData {
  email: string;
  password: string;
  fullName?: string;
}

export interface LoginState {
  mode: LoginMode;
  formData: LoginFormData;
  showPassword: boolean;
  loading: boolean;
  error: Error | null;
}

export interface LoginFormActions {
  handleLogin: () => Promise<void>;
  handleSignUp: () => Promise<void>;
  handleForgotPassword: () => void;
  toggleMode: () => void;
  togglePasswordVisibility: () => void;
  updateEmail: (email: string) => void;
  updatePassword: (password: string) => void;
  updateFullName: (fullName: string) => void;
}
