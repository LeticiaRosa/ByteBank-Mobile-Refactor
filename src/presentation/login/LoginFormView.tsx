/**
 * Presentation Layer - Login Form View
 * Componente de apresentação puro (stateless)
 * Responsável apenas pela renderização visual
 * Segue o princípio de Responsabilidade Única (S do SOLID)
 */

import {
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  PiggyBankIcon,
} from "lucide-react-native";
import { getTheme } from "../../styles/theme";
import { CustomText } from "../ui/Text";
import { LoginMode, LoginFormData } from "../../domain/login/LoginState";

interface LoginFormViewProps {
  mode: LoginMode;
  formData: LoginFormData;
  showPassword: boolean;
  loading: boolean;
  isDark: boolean;
  onLogin: () => void;
  onSignUp: () => void;
  onForgotPassword: () => void;
  onToggleMode: () => void;
  onTogglePasswordVisibility: () => void;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onFullNameChange: (fullName: string) => void;
}

export function LoginFormView({
  mode,
  formData,
  showPassword,
  loading,
  isDark,
  onLogin,
  onSignUp,
  onForgotPassword,
  onToggleMode,
  onTogglePasswordVisibility,
  onEmailChange,
  onPasswordChange,
  onFullNameChange,
}: LoginFormViewProps) {
  const theme = getTheme(isDark);
  const backgroundColor = theme.background;
  const iconColor = theme.primary;
  const inputBackgroundColor = theme.muted;
  const borderColor = theme.border;
  const primaryButtonBg = theme.primary;
  const textColor = theme.foreground;

  const isSignUpMode = mode === "signup";

  return (
    <View
      style={{
        flex: 1,
        backgroundColor,
        alignItems: "center",
        justifyContent: "center",
      }}
      className="flex-1 bg-gray-1 dark:bg-dark-background w-full h-full"
    >
      {/* Header */}
      <View
        style={{
          padding: 20,
          alignItems: "center",
          backgroundColor,
        }}
        className="p-5 items-center bg-card dark:bg-dark-card"
      >
        <View
          style={{
            width: 96,
            height: 96,
            borderRadius: 48,
            backgroundColor: inputBackgroundColor,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 16,
          }}
          className="w-24 h-24 rounded-full bg-gray-3 dark:bg-dark-gray-5 justify-center items-center mb-4"
        >
          <PiggyBankIcon size={48} color={iconColor} />
        </View>
        <CustomText className="text-2xl font-bold text-card-foreground dark:text-dark-card-foreground">
          ByteBank
        </CustomText>
        <CustomText className="text-gray-11 dark:text-gray-4 text-center mt-2">
          {isSignUpMode
            ? "Crie sua conta para começar"
            : "Faça login para acessar sua conta"}
        </CustomText>
      </View>

      {/* Formulário */}
      <View className="w-full px-6">
        {/* Campo Nome Completo - apenas no modo cadastro */}
        {isSignUpMode && (
          <View style={{ marginBottom: 16 }}>
            <CustomText className="font-medium text-card-foreground dark:text-dark-card-foreground mb-2">
              Nome Completo
            </CustomText>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: inputBackgroundColor,
                borderColor,
                borderWidth: 1,
                borderRadius: 8,
                paddingHorizontal: 12,
                height: 48,
              }}
            >
              <User size={20} color={iconColor} />
              <TextInput
                style={{
                  flex: 1,
                  marginLeft: 8,
                  color: textColor,
                  fontSize: 16,
                }}
                placeholder="Digite seu nome completo"
                placeholderTextColor={isDark ? "#9ca3af" : "#6b7280"}
                value={formData.fullName}
                onChangeText={onFullNameChange}
                autoCapitalize="words"
                autoCorrect={false}
                editable={!loading}
              />
            </View>
          </View>
        )}

        {/* Campo Email */}
        <View style={{ marginBottom: 16 }}>
          <CustomText className="font-medium text-card-foreground dark:text-dark-card-foreground mb-2">
            Email
          </CustomText>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: inputBackgroundColor,
              borderColor,
              borderWidth: 1,
              borderRadius: 8,
              paddingHorizontal: 12,
              height: 48,
            }}
          >
            <User size={20} color={iconColor} />
            <TextInput
              style={{
                flex: 1,
                marginLeft: 8,
                color: textColor,
                fontSize: 16,
              }}
              placeholder="Digite seu email"
              placeholderTextColor={isDark ? "#9ca3af" : "#6b7280"}
              value={formData.email}
              onChangeText={onEmailChange}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />
          </View>
        </View>

        {/* Campo Senha */}
        <View style={{ marginBottom: 16 }}>
          <CustomText className="font-medium text-card-foreground dark:text-dark-card-foreground mb-2">
            Senha
          </CustomText>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: inputBackgroundColor,
              borderColor,
              borderWidth: 1,
              borderRadius: 8,
              paddingHorizontal: 12,
              height: 48,
            }}
          >
            <Lock size={20} color={iconColor} />
            <TextInput
              style={{
                flex: 1,
                marginLeft: 8,
                color: textColor,
                fontSize: 16,
              }}
              placeholder="Digite sua senha"
              placeholderTextColor={isDark ? "#9ca3af" : "#6b7280"}
              value={formData.password}
              onChangeText={onPasswordChange}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />
            <TouchableOpacity
              onPress={onTogglePasswordVisibility}
              style={{ padding: 4 }}
              disabled={loading}
            >
              {showPassword ? (
                <EyeOff size={20} color={iconColor} />
              ) : (
                <Eye size={20} color={iconColor} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Esqueceu a senha - apenas no modo login */}
        {!isSignUpMode && (
          <TouchableOpacity
            onPress={onForgotPassword}
            style={{ alignSelf: "flex-end", marginBottom: 24 }}
            disabled={loading}
          >
            <CustomText className="text-primary text-sm">
              Esqueceu sua senha?
            </CustomText>
          </TouchableOpacity>
        )}

        {/* Botão Principal */}
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: primaryButtonBg,
            borderRadius: 8,
            height: 48,
            marginTop: isSignUpMode ? 24 : 0,
            opacity: loading ? 0.7 : 1,
          }}
          onPress={isSignUpMode ? onSignUp : onLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <LogIn size={20} color="#ffffff" />
          )}
          <CustomText className="text-white font-semibold ml-2">
            {loading
              ? isSignUpMode
                ? "Criando conta..."
                : "Entrando..."
              : isSignUpMode
              ? "Criar Conta"
              : "Entrar"}
          </CustomText>
        </TouchableOpacity>

        {/* Alternância entre Login e Cadastro */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 24,
          }}
        >
          <CustomText className="text-gray-11 dark:text-gray-4">
            {isSignUpMode ? "Já tem uma conta? " : "Não tem uma conta? "}
          </CustomText>
          <TouchableOpacity onPress={onToggleMode} disabled={loading}>
            <CustomText className="text-primary font-medium">
              {isSignUpMode ? "Fazer Login" : "Cadastre-se"}
            </CustomText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
