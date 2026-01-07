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
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../../hooks/useTheme";
import { getThemeColors } from "../../../styles/theme";
import { styles } from "./styles";

// Lazy load das telas com logs
const startTime = performance.now();
console.log("🚀 [Sidebar] Iniciando lazy load dos componentes");

const Home = lazy(() => {
  const loadStart = performance.now();
  console.log("⏳ [Sidebar] Carregando Home...");
  return import("../Home").then((m) => {
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
  return import("../Transactions").then((m) => {
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
  return import("../../../presentation/profile/Profile").then((m) => {
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
  return import("../Extrato").then((m) => {
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

// Componente de Loading para Suspense
function ScreenLoader() {
  const { isDark } = useTheme();
  const theme = getThemeColors(isDark);

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
      style={[loaderStyles.container, { backgroundColor: theme.background }]}
    >
      <ActivityIndicator size="large" color={theme.primary} />
      <Text style={[loaderStyles.text, { color: theme.foreground }]}>
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

export function MyDrawer() {
  const { isDark } = useTheme();
  const navigation = useNavigation();

  useEffect(() => {
    const initEnd = performance.now();
    console.log(
      `🎉 [MyDrawer] Drawer inicializado em ${(initEnd - startTime).toFixed(
        2
      )}ms`
    );
  }, []);

  // Cores baseadas no theme.ts simplificado
  const theme = getThemeColors(isDark);
  const mainColor = theme.primary;
  const secondaryColor = theme.secondary;
  const accentColor = theme.sidebar;

  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: mainColor,
        },
        headerTintColor: accentColor,
        drawerStyle: {
          backgroundColor: accentColor,
          width: styles.drawerContainer.width,
        },
        drawerInactiveTintColor: theme.sidebarForeground,
        drawerActiveTintColor: theme.sidebarForeground,
        drawerActiveBackgroundColor: secondaryColor,
        drawerLabelStyle: {
          color: theme.sidebarForeground,
          marginLeft: 12, // Padding entre ícone e texto
        },

        headerRight: () => (
          <TouchableOpacity
            onPress={() => navigation.navigate("Perfil")}
            style={styles.headerButton}
          >
            <UserCircle color={accentColor} size={24} />
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
          <Suspense fallback={<ScreenLoader />}>
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
          <Suspense fallback={<ScreenLoader />}>
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
          <Suspense fallback={<ScreenLoader />}>
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
          <Suspense fallback={<ScreenLoader />}>
            <Profile {...props} />
          </Suspense>
        )}
      </Drawer.Screen>
    </Drawer.Navigator>
  );
}
