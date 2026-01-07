/**
 * Presentation Layer - Sidebar View
 * Componente de apresentação puro (stateless)
 * Responsável apenas pela renderização visual do Drawer Navigator
 * Segue o princípio de Responsabilidade Única (S do SOLID)
 */

import { lazy, Suspense, useEffect } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import {
  House,
  ArrowRightLeft,
  ScrollText,
  UserCircle,
} from "lucide-react-native";
import { TouchableOpacity } from "react-native";
import { SidebarTheme } from "../../domain/sidebar/SidebarState";

// Lazy load das telas com logs
const startTime = performance.now();
console.log("🚀 [Sidebar] Iniciando lazy load dos componentes");

const Home = lazy(() => {
  const loadStart = performance.now();
  console.log("⏳ [Sidebar] Carregando Home...");
  return import("../../components/UserRoutes/Home").then((m) => {
    const loadEnd = performance.now();
    console.log(
      `✅ [Sidebar] Home carregado em ${(loadEnd - loadStart).toFixed(2)}ms`
    );
    return { default: m.Home };
  });
});

const Transactions = lazy(() => {
  const loadStart = performance.now();
  console.log("⏳ [Sidebar] Carregando Transactions...");
  return import("../../components/UserRoutes/Transactions").then((m) => {
    const loadEnd = performance.now();
    console.log(
      `✅ [Sidebar] Transactions carregado em ${(loadEnd - loadStart).toFixed(
        2
      )}ms`
    );
    return { default: m.Transactions };
  });
});

const Profile = lazy(() => {
  const loadStart = performance.now();
  console.log("⏳ [Sidebar] Carregando Profile...");
  return import("../profile/Profile").then((m) => {
    const loadEnd = performance.now();
    console.log(
      `✅ [Sidebar] Profile carregado em ${(loadEnd - loadStart).toFixed(2)}ms`
    );
    return { default: m.Profile };
  });
});

const ExtractPage = lazy(() => {
  const loadStart = performance.now();
  console.log("⏳ [Sidebar] Carregando ExtractPage...");
  return import("../../components/UserRoutes/Extrato").then((m) => {
    const loadEnd = performance.now();
    console.log(
      `✅ [Sidebar] ExtractPage carregado em ${(loadEnd - loadStart).toFixed(
        2
      )}ms`
    );
    return { default: m.ExtractPage };
  });
});

const Drawer = createDrawerNavigator();

interface SidebarViewProps {
  theme: SidebarTheme;
  onNavigateToProfile: () => void;
}

// Componente de Loading para Suspense
function ScreenLoader({ theme }: { theme: SidebarTheme }) {
  useEffect(() => {
    const loadStart = performance.now();
    console.log("🔄 [ScreenLoader] Exibindo loader...");

    return () => {
      const loadEnd = performance.now();
      console.log(
        `⏱️ [ScreenLoader] Loader exibido por ${(loadEnd - loadStart).toFixed(
          2
        )}ms`
      );
    };
  }, []);

  return (
    <View
      style={[loaderStyles.container, { backgroundColor: theme.mainColor }]}
    >
      <ActivityIndicator size="large" color={theme.accentColor} />
      <Text style={[loaderStyles.text, { color: theme.labelColor }]}>
        Carregando...
      </Text>
    </View>
  );
}

const loaderStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    marginTop: 12,
    fontSize: 16,
  },
});

const styles = StyleSheet.create({
  headerButton: {
    marginRight: 15,
  },
});

export function SidebarView({ theme, onNavigateToProfile }: SidebarViewProps) {
  useEffect(() => {
    const initEnd = performance.now();
    console.log(
      `🎉 [SidebarView] Drawer inicializado em ${(initEnd - startTime).toFixed(
        2
      )}ms`
    );
  }, []);

  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.mainColor,
        },
        headerTintColor: theme.accentColor,
        drawerStyle: {
          backgroundColor: theme.accentColor,
          width: 240,
        },
        drawerInactiveTintColor: theme.inactiveTintColor,
        drawerActiveTintColor: theme.activeTintColor,
        drawerActiveBackgroundColor: theme.activeBackgroundColor,
        drawerLabelStyle: {
          color: theme.labelColor,
          marginLeft: 12,
        },
        headerRight: () => (
          <TouchableOpacity
            onPress={onNavigateToProfile}
            style={styles.headerButton}
          >
            <UserCircle color={theme.accentColor} size={24} />
          </TouchableOpacity>
        ),
      }}
    >
      <Drawer.Screen
        name="Inicio"
        options={{
          drawerIcon: ({ color, size }: { color?: string; size?: number }) => (
            <House color={color} size={size ?? 18} />
          ),
        }}
      >
        {(props: any) => (
          <Suspense fallback={<ScreenLoader theme={theme} />}>
            <Home {...props} />
          </Suspense>
        )}
      </Drawer.Screen>

      <Drawer.Screen
        name="Nova Transação"
        options={{
          drawerIcon: ({ color, size }: { color?: string; size?: number }) => (
            <ArrowRightLeft color={color} size={size ?? 18} />
          ),
        }}
      >
        {(props: any) => (
          <Suspense fallback={<ScreenLoader theme={theme} />}>
            <Transactions {...props} />
          </Suspense>
        )}
      </Drawer.Screen>

      <Drawer.Screen
        name="Extrato"
        options={{
          drawerIcon: ({ color, size }: { color?: string; size?: number }) => (
            <ScrollText color={color} size={size ?? 18} />
          ),
        }}
      >
        {(props: any) => (
          <Suspense fallback={<ScreenLoader theme={theme} />}>
            <ExtractPage {...props} />
          </Suspense>
        )}
      </Drawer.Screen>

      <Drawer.Screen
        name="Perfil"
        options={{
          drawerIcon: ({ color, size }: { color?: string; size?: number }) => (
            <UserCircle color={color} size={size ?? 18} />
          ),
        }}
      >
        {(props: any) => (
          <Suspense fallback={<ScreenLoader theme={theme} />}>
            <Profile {...props} />
          </Suspense>
        )}
      </Drawer.Screen>
    </Drawer.Navigator>
  );
}
