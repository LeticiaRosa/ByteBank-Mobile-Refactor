import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaView, StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { getTheme } from "../../styles/theme";
import { useTheme } from "../../hooks/useTheme";
import { Sidebar } from "../../presentation/sidebar/Sidebar";

// Componente interno que usa o hook
export function UserRoutes() {
  const { isDark } = useTheme();
  const theme = getTheme(isDark);

  const backgroundColor = theme.background;
  const cardBackgroundColor = theme.card;
  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: backgroundColor,
        }}
      >
        <StatusBar
          barStyle={isDark ? "dark-content" : "light-content"}
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
