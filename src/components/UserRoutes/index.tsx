import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaView, StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { MyDrawer } from "./Sidebar";
import { getTheme } from "../../styles/theme";
import { useTheme } from "../../hooks/useTheme";

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
          <MyDrawer />
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
