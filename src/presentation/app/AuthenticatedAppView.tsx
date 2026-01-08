/**
 * Presentation Layer - Authenticated App View
 * Componente de apresentação puro que renderiza o shell do app autenticado
 *
 * Responsabilidades:
 * - Configurar SafeAreaProvider
 * - Configurar StatusBar com tema
 * - Configurar NavigationContainer
 * - Renderizar Sidebar (navegação principal)
 */

import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaView, StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Sidebar } from "../sidebar/Sidebar";

interface AuthenticatedAppViewProps {
  backgroundColor: string;
  cardBackgroundColor: string;
  statusBarStyle: "light-content" | "dark-content";
}

export function AuthenticatedAppView({
  backgroundColor,
  cardBackgroundColor,
  statusBarStyle,
}: AuthenticatedAppViewProps) {
  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: backgroundColor,
        }}
      >
        <StatusBar
          barStyle={statusBarStyle}
          backgroundColor={cardBackgroundColor}
          translucent={false}
        />
        <NavigationContainer>
          <Sidebar />
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
