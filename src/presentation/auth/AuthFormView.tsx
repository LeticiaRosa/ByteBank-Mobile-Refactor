/**
 * Presentation Layer - Auth Form View
 * Componente de apresentação puro (stateless)
 * Responsável apenas pela renderização visual
 * Segue o princípio de Responsabilidade Única (S do SOLID)
 */

import { View, ActivityIndicator } from "react-native";
import { AuthStatus } from "../../domain/auth/AuthState";
import { UserRoutes } from "../../components/UserRoutes";
import { LoginForm } from "../login/LoginForm";

interface AuthFormViewProps {
  authStatus: AuthStatus;
}

export function AuthFormView({ authStatus }: AuthFormViewProps) {
  // Loading state durante a inicialização
  if (authStatus === "loading") {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
        className="bg-gray-1 dark:bg-gray-12"
      >
        <ActivityIndicator size="large" color="#0066cc" />
      </View>
    );
  }

  // Usuário autenticado - mostra rotas do usuário
  if (authStatus === "authenticated") {
    return <UserRoutes />;
  }

  // Usuário não autenticado - mostra tela de login
  return (
    <View style={{ flex: 1 }} className="bg-gray-1 dark:bg-gray-12">
      <LoginForm />
    </View>
  );
}
