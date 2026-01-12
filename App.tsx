import "./global.css";
import { ThemeProvider } from "./src/hooks/useTheme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { toastConfig } from "./src/presentation/ui/ToastConfig";
import { AuthForm } from "./src/presentation/auth/AuthForm";

// Criar instância do QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // 2 minutos (aumentado de 15s para reduzir requisições)
      gcTime: 1000 * 60 * 30, // 30 minutos de cache (garbage collection time)
      retry: 2,
      refetchOnWindowFocus: false, // Desabilitado - Realtime mantém dados atualizados
      refetchOnMount: false, // Desabilitado - usa cache quando disponível
      refetchOnReconnect: true, // Mantido - importante reconectar após perda de conexão
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthForm />
      </ThemeProvider>
      <Toast config={toastConfig} />
    </QueryClientProvider>
  );
}
