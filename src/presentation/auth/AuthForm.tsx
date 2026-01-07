/**
 * Presentation Layer - Auth Form Container
 * Container component que gerencia a lógica e conecta com a camada de infraestrutura
 * Segue o padrão Container/Presenter
 */

import { useAuthAdapter } from "../../infrastructure/auth/useAuthAdapter";
import { AuthFormView } from "./AuthFormView";

export function AuthForm() {
  const { authStatus } = useAuthAdapter();

  return <AuthFormView authStatus={authStatus} />;
}
