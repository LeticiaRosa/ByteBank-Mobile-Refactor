/**
 * Presentation Layer - Login Form Container
 * Container component que gerencia a lógica e conecta com a camada de infraestrutura
 * Segue o padrão Container/Presenter
 */

import { useLoginAdapter } from "../../infrastructure/login/useLoginAdapter";
import { LoginFormView } from "./LoginFormView";

export function LoginForm() {
  const { mode, formData, showPassword, loading, isDark, actions } =
    useLoginAdapter();

  return (
    <LoginFormView
      mode={mode}
      formData={formData}
      showPassword={showPassword}
      loading={loading}
      isDark={isDark}
      onLogin={actions.handleLogin}
      onSignUp={actions.handleSignUp}
      onForgotPassword={actions.handleForgotPassword}
      onToggleMode={actions.toggleMode}
      onTogglePasswordVisibility={actions.togglePasswordVisibility}
      onEmailChange={actions.updateEmail}
      onPasswordChange={actions.updatePassword}
      onFullNameChange={actions.updateFullName}
    />
  );
}
