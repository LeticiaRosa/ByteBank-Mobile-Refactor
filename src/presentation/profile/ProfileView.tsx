/**
 * Presentation Layer - Profile View
 * Componente de apresentação puro (stateless)
 * Responsável apenas pela renderização visual
 * Segue o princípio de Responsabilidade Única (S do SOLID)
 */

import { View, Switch, TouchableOpacity } from "react-native";
import {
  User,
  Moon,
  Sun,
  ChevronRight,
  LogOut,
  Shield,
  Bell,
  HelpCircle,
} from "lucide-react-native";
import { CustomText } from "../ui/Text";
import {
  ProfileState,
  ProfileActions,
  ProfileOption,
} from "../../domain/profile/ProfileState";

/**
 * Helper function para renderizar o ícone correto baseado no iconName
 */
function renderIcon(iconName: ProfileOption["iconName"], color: string) {
  const iconProps = { size: 20, color };

  switch (iconName) {
    case "shield":
      return <Shield {...iconProps} />;
    case "bell":
      return <Bell {...iconProps} />;
    case "help-circle":
      return <HelpCircle {...iconProps} />;
    default:
      return null;
  }
}

interface ProfileViewProps extends ProfileState, ProfileActions {}

export function ProfileView({
  user,
  isDark,
  theme,
  profileOptions,
  toggleTheme,
  signOut,
}: ProfileViewProps) {
  const iconColor = theme.primary;
  const backgroundColor = theme.background;
  const cardBackgroundColor = theme.card;
  const profileImageBg = theme.muted;
  const borderColor = theme.border;
  const switchTrackColor = isDark ? theme.muted : theme.border;
  const logoutButtonBg = theme.muted;

  return (
    <View
      style={[{ backgroundColor }, { flex: 1 }]}
      className="flex-1 bg-gray-1 dark:bg-dark-background"
    >
      {/* Header */}
      <View
        style={[
          { backgroundColor: cardBackgroundColor },
          { padding: 20, alignItems: "center" },
        ]}
        className="p-5 items-center bg-card dark:bg-dark-card"
      >
        <View
          style={[
            {
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: profileImageBg,
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 8,
            },
          ]}
          className="w-20 h-20 rounded-full bg-gray-3 dark:bg-dark-gray-5 justify-center items-center mb-2"
        >
          <User size={40} color={iconColor} />
        </View>
        <CustomText className="text-gray-12 text-lg font-bold dark:text-dark-card-foreground">
          {user?.user_metadata?.full_name || "-"}
        </CustomText>
        <CustomText>{user?.email}</CustomText>
      </View>

      {/* Configurações */}
      <View style={{ padding: 20 }}>
        <CustomText className="font-bold text-card-foreground dark:text-dark-card-foreground">
          Configurações
        </CustomText>

        {/* Modo Escuro */}
        <View
          style={[
            {
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingVertical: 16,
              borderBottomColor: borderColor,
              borderBottomWidth: 1,
            },
          ]}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            {isDark ? (
              <Moon size={20} color={iconColor} />
            ) : (
              <Sun size={20} color={iconColor} />
            )}
            <CustomText>Modo Escuro</CustomText>
          </View>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{
              false: switchTrackColor,
              true: iconColor,
            }}
            thumbColor={isDark ? "#4089ee" : "#f4f3f4"}
          />
        </View>

        {/* Outras opções */}
        {profileOptions.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              {
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingVertical: 16,
                borderBottomColor: borderColor,
                borderBottomWidth: index === profileOptions.length - 1 ? 0 : 1,
              },
            ]}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
            >
              {renderIcon(option.iconName, iconColor)}
              <CustomText>{option.title}</CustomText>
            </View>
            <ChevronRight size={18} color={iconColor} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Sair */}
      <TouchableOpacity
        style={[
          {
            borderWidth: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            padding: 16,
            margin: 20,
            borderRadius: 8,
            backgroundColor: logoutButtonBg,
            borderColor: iconColor,
          },
        ]}
        onPress={signOut}
      >
        <LogOut size={18} color={iconColor} />
        <CustomText>Sair da Conta</CustomText>
      </TouchableOpacity>
    </View>
  );
}
