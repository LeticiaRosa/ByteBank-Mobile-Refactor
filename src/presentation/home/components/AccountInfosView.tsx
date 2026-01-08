/**
 * Presentation Layer - Account Infos View
 * Componente de apresentação puro (stateless)
 * Responsável apenas pela renderização visual
 * Segue o princípio de Responsabilidade Única (S do SOLID)
 */

import { TouchableOpacity, View, Animated } from "react-native";
import { Eye, EyeOff } from "lucide-react-native";
import { CustomText } from "../../../components/ui/Text";
import type { AccountInfosViewState } from "../../../domain/home/components";

export function AccountInfosView({
  title,
  amount,
  text,
  isLoadingAccounts,
  showeye = true,
  icon,
  isRealtimeConnected = false,
  isBalanceVisible,
  toggleBalanceVisibility,
  handlePressIn,
  handlePressOut,
  scaleAnim,
  opacityAnim,
  skeletonStyle,
  theme,
  formatValue,
  getAmountColorClass,
}: AccountInfosViewState) {
  const {
    cardBackgroundColor,
    cardForegroundColor,
    iconColor,
    borderColor,
    mutedColor,
  } = theme;

  if (isLoadingAccounts) {
    return (
      <Animated.View
        style={[
          {
            backgroundColor: cardBackgroundColor,
            borderColor: borderColor,
          },
          skeletonStyle,
        ]}
        className="rounded-lg shadow-sm border p-4 w-full border-gray-1"
      >
        <View className="flex flex-row justify-between items-start">
          <View className="flex flex-row items-center pl-2 gap-2">
            <Animated.View
              style={[
                {
                  backgroundColor: mutedColor,
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                },
                skeletonStyle,
              ]}
            />
            <View className="flex flex-col px-2">
              <Animated.View
                style={[
                  {
                    backgroundColor: mutedColor,
                    height: 16,
                    width: 80,
                    borderRadius: 4,
                    marginBottom: 8,
                  },
                  skeletonStyle,
                ]}
              />
              <Animated.View
                style={[
                  {
                    backgroundColor: mutedColor,
                    height: 20,
                    width: 120,
                    borderRadius: 4,
                  },
                  skeletonStyle,
                ]}
              />
            </View>
          </View>
          <Animated.View
            style={[
              {
                backgroundColor: mutedColor,
                width: 32,
                height: 32,
                borderRadius: 16,
              },
              skeletonStyle,
            ]}
          />
        </View>
      </Animated.View>
    );
  }

  if (amount < 0) {
    return null;
  }

  return (
    <Animated.View
      style={[
        {
          backgroundColor: cardBackgroundColor,
          borderColor: borderColor,
          transform: [{ scale: scaleAnim }],
        },
      ]}
      className="rounded-lg shadow-sm border p-4 w-full border-gray-1"
    >
      <View className="flex flex-row justify-between items-start">
        <View className="flex flex-row items-center pl-2 gap-2">
          {icon && (
            <Animated.View
              style={[
                {
                  backgroundColor: cardForegroundColor,
                  transform: [{ scale: scaleAnim }],
                },
              ]}
              className="w-12 h-12 items-center justify-center rounded-full"
            >
              {icon}
            </Animated.View>
          )}
          <View className="flex flex-col px-2">
            <View className="flex-row items-center gap-2 mb-2">
              <CustomText className="font-semibold text-card-foreground text-md">
                {title}
              </CustomText>
              {isRealtimeConnected && (
                <View
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: "#10b981",
                  }}
                />
              )}
            </View>
            <Animated.View style={{ opacity: opacityAnim }}>
              <CustomText
                className={`text-2xl font-bold ${getAmountColorClass()}`}
              >
                {isBalanceVisible ? formatValue(amount) : "••••••"}
              </CustomText>
            </Animated.View>
          </View>
        </View>
        {showeye && (
          <View className="flex justify-end">
            <TouchableOpacity
              onPress={toggleBalanceVisibility}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              className="h-8 w-8"
            >
              {isBalanceVisible ? (
                <EyeOff size={22} color={iconColor} />
              ) : (
                <Eye size={22} color={iconColor} />
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>

      {text && (
        <CustomText className="text-md text-muted-foreground">
          {text}
        </CustomText>
      )}
    </Animated.View>
  );
}
