/**
 * Infrastructure Layer - Login Adapter
 * Adapta hooks existentes (useAuth, useTheme, useToast) para a camada de apresentação
 * Isola implementações técnicas da camada de apresentação
 */

import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";
import { useToast } from "../../hooks/useToast";
import {
  LoginMode,
  LoginFormData,
  LoginFormActions,
} from "../../domain/login/LoginState";

export interface LoginAdapter {
  // Estado
  mode: LoginMode;
  formData: LoginFormData;
  showPassword: boolean;
  loading: boolean;

  // Theme
  isDark: boolean;

  // Ações
  actions: LoginFormActions;
}

/**
 * Hook adapter que conecta os hooks originais à arquitetura limpa
 */
export function useLoginAdapter(): LoginAdapter {
  const { signIn, signUp, loading } = useAuth();
  const { isDark } = useTheme();
  const { validationError, authError, authSuccess, showInfo } = useToast();

  // Estado local do formulário
  const [mode, setMode] = useState<LoginMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const formData: LoginFormData = {
    email,
    password,
    fullName,
  };

  const handleLogin = async () => {
    if (!email || !password) {
      validationError("Por favor, preencha todos os campos");
      return;
    }

    const result = await signIn(email, password);

    if (!result.success) {
      authError(result.error?.message || "Erro ao fazer login");
    }
  };

  const handleSignUp = async () => {
    if (!email || !password || !fullName) {
      validationError("Por favor, preencha todos os campos");
      return;
    }

    if (password.length < 6) {
      validationError("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    const result = await signUp(email, password, fullName);

    if (result.success) {
      authSuccess(
        "Conta criada com sucesso! Verifique seu email para confirmar a conta."
      );
      setMode("login");
      // Limpar campos
      setEmail("");
      setPassword("");
      setFullName("");
    } else {
      authError(result.error?.message || "Erro ao criar conta");
    }
  };

  const handleForgotPassword = () => {
    showInfo({
      message: "Funcionalidade em desenvolvimento",
      title: "Recuperar Senha",
    });
  };

  const toggleMode = () => {
    setMode((prevMode) => (prevMode === "login" ? "signup" : "login"));
    // Limpar campos ao trocar de modo
    setEmail("");
    setPassword("");
    setFullName("");
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const actions: LoginFormActions = {
    handleLogin,
    handleSignUp,
    handleForgotPassword,
    toggleMode,
    togglePasswordVisibility,
    updateEmail: setEmail,
    updatePassword: setPassword,
    updateFullName: setFullName,
  };

  return {
    mode,
    formData,
    showPassword,
    loading,
    isDark,
    actions,
  };
}
