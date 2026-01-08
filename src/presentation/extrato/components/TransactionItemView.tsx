/**
 * Presentation Layer - TransactionItem View
 *
 * Componente visual stateless para renderizar um item de transação.
 * Segue o princípio de Responsabilidade Única (S do SOLID).
 */

import { View, Text, TouchableOpacity } from "react-native";
import { Transaction } from "../../../lib/transactions";
import { getTheme, getColorScale, colors } from "../../../styles/theme";
import { MoneyUtils } from "../../../utils";

interface TransactionItemViewProps {
  transaction: Transaction;
  isDark: boolean;
  isMenuVisible: boolean;
  onToggleMenu: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onProcess?: (action: "complete" | "fail") => void;
}

export function TransactionItemView({
  transaction,
  isDark,
  isMenuVisible,
  onToggleMenu,
  onEdit,
  onDelete,
  onProcess,
}: TransactionItemViewProps) {
  const theme = getTheme(isDark);
  const colorScale = getColorScale(isDark);

  const transactionColors = {
    cardBackground: theme.card,
    iconBackground: theme.muted,
    textPrimary: theme.foreground,
    textSecondary: theme.mutedForeground,
    textMuted: colorScale.gray[10],
    depositBg: isDark ? colorScale.gray[3] : colorScale.gray[2],
    depositText: colors.charts.main.green,
    withdrawalBg: isDark ? colorScale.gray[3] : colorScale.gray[2],
    withdrawalText: colors.destructive[isDark ? "dark" : "light"],
    transferBg: isDark ? colorScale.blue[3] : colorScale.blue[2],
    transferText: colors.charts.main.blue,
    paymentBg: isDark ? colorScale.gray[3] : colorScale.gray[2],
    paymentText: colors.charts.main.orange,
    categoryBg: theme.accent,
    categoryText: theme.accentForeground,
    completedBg: isDark ? colorScale.gray[3] : colorScale.gray[2],
    completedText: colors.charts.main.green,
    pendingBg: isDark ? colorScale.gray[3] : colorScale.gray[2],
    pendingText: colors.charts.main.yellow,
    failedBg: isDark ? colorScale.gray[3] : colorScale.gray[2],
    failedText: colors.destructive[isDark ? "dark" : "light"],
    cancelledBg: theme.muted,
    cancelledText: theme.mutedForeground,
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatAmount = (amount: number) => {
    return amount.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const getTransactionTypeLabel = (type: string) => {
    const types = {
      deposit: "Depósito",
      withdrawal: "Saque",
      transfer: "Transferência",
      payment: "Pagamento",
      fee: "Taxa",
    };
    return types[type as keyof typeof types] || type;
  };

  const getCategoryLabel = (category: string) => {
    const categories = {
      alimentacao: "Alimentação",
      transporte: "Transporte",
      saude: "Saúde",
      educacao: "Educação",
      entretenimento: "Entretenimento",
      compras: "Compras",
      casa: "Casa",
      trabalho: "Trabalho",
      investimentos: "Investimentos",
      viagem: "Viagem",
      outros: "Outros",
    };
    return categories[category as keyof typeof categories] || category;
  };

  const getAmountPrefix = (type: string) => {
    return type === "deposit" ? "+" : "-";
  };

  const getTransactionIcon = () => {
    const iconColor = {
      deposit: "#16a34a",
      withdrawal: "#dc2626",
      transfer: "#2563eb",
      payment: "#ea580c",
      fee: "#71717a",
    };

    const iconSymbol = {
      deposit: "↑",
      withdrawal: "↓",
      transfer: "→",
      payment: "$",
      fee: "!",
    };

    return {
      color:
        iconColor[transaction.transaction_type as keyof typeof iconColor] ||
        "#71717a",
      symbol:
        iconSymbol[transaction.transaction_type as keyof typeof iconSymbol] ||
        "?",
    };
  };

  const icon = getTransactionIcon();

  return (
    <View
      style={{
        backgroundColor: transactionColors.cardBackground,
        borderRadius: 12,
        marginVertical: 8,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0.3 : 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "row", flex: 1, gap: 16 }}>
          {/* Ícone do tipo de transação */}
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: transactionColors.iconBackground,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 20, color: icon.color }}>
              {icon.symbol}
            </Text>
          </View>

          {/* Informações da transação */}
          <View style={{ flex: 1 }}>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 8,
                marginBottom: 4,
              }}
            >
              <View
                style={{
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: 12,
                  backgroundColor:
                    transaction.transaction_type === "deposit"
                      ? transactionColors.depositBg
                      : transaction.transaction_type === "withdrawal" ||
                        transaction.transaction_type === "fee"
                      ? transactionColors.withdrawalBg
                      : transaction.transaction_type === "transfer"
                      ? transactionColors.transferBg
                      : transactionColors.paymentBg,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "600",
                    color:
                      transaction.transaction_type === "deposit"
                        ? transactionColors.depositText
                        : transaction.transaction_type === "withdrawal" ||
                          transaction.transaction_type === "fee"
                        ? transactionColors.withdrawalText
                        : transaction.transaction_type === "transfer"
                        ? transactionColors.transferText
                        : transactionColors.paymentText,
                  }}
                >
                  {getTransactionTypeLabel(transaction.transaction_type)}
                </Text>
              </View>

              <View
                style={{
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: 12,
                  backgroundColor: transactionColors.categoryBg,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "600",
                    color: transactionColors.categoryText,
                  }}
                >
                  {getCategoryLabel(transaction.category)}
                </Text>
              </View>

              <View
                style={{
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: theme.border,
                  backgroundColor:
                    transaction.status === "completed"
                      ? transactionColors.completedBg
                      : transaction.status === "pending"
                      ? transactionColors.pendingBg
                      : transaction.status === "failed"
                      ? transactionColors.failedBg
                      : transactionColors.cancelledBg,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "600",
                    color:
                      transaction.status === "completed"
                        ? transactionColors.completedText
                        : transaction.status === "pending"
                        ? transactionColors.pendingText
                        : transaction.status === "failed"
                        ? transactionColors.failedText
                        : transactionColors.cancelledText,
                  }}
                >
                  {transaction.status === "completed" && "Concluída"}
                  {transaction.status === "pending" && "Pendente"}
                  {transaction.status === "failed" && "Falhou"}
                  {transaction.status === "cancelled" && "Cancelada"}
                </Text>
              </View>
            </View>

            <Text
              style={{
                fontSize: 16,
                fontWeight: "500",
                color: transactionColors.textPrimary,
              }}
            >
              {transaction.description || "Sem descrição"}
            </Text>

            {transaction.sender_name && (
              <Text
                style={{ fontSize: 14, color: transactionColors.textSecondary }}
              >
                <Text style={{ fontWeight: "500" }}>Remetente:</Text>{" "}
                {transaction.sender_name}
              </Text>
            )}

            <Text
              style={{
                fontSize: 14,
                color: transactionColors.textSecondary,
                marginTop: 4,
              }}
            >
              {formatDate(transaction.created_at)}
            </Text>
          </View>
        </View>

        {/* Valor e Menu */}
        <View
          style={{
            alignItems: "flex-end",
            gap: 16,
            justifyContent: "space-between",
          }}
        >
          {/* Menu de três pontos */}
          <View
            style={{
              position: "relative",
              marginTop: 8,
            }}
          >
            <TouchableOpacity
              style={{
                padding: 8,
                borderRadius: 16,
                backgroundColor: transactionColors.iconBackground,
                width: 32,
                height: 32,
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={onToggleMenu}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  color: transactionColors.textPrimary,
                  lineHeight: 16,
                }}
              >
                ⋯
              </Text>
            </TouchableOpacity>

            {/* Menu dropdown */}
            {isMenuVisible && (
              <>
                {/* Overlay invisível para fechar o menu quando clicar fora */}
                <TouchableOpacity
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 9999,
                  }}
                  onPress={onToggleMenu}
                  activeOpacity={1}
                />

                {/* Menu posicionado relativamente ao botão */}
                <View
                  style={{
                    position: "absolute",
                    top: 40,
                    right: 0,
                    backgroundColor: transactionColors.cardBackground,
                    borderRadius: 8,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: isDark ? 0.4 : 0.15,
                    shadowRadius: 8,
                    elevation: 8,
                    minWidth: 140,
                    borderWidth: 1,
                    borderColor: theme.border,
                    zIndex: 10000,
                  }}
                >
                  {onEdit && (
                    <TouchableOpacity
                      style={{
                        paddingHorizontal: 16,
                        paddingVertical: 12,
                        borderBottomWidth: onDelete ? 1 : 0,
                        borderBottomColor: theme.border,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                      }}
                      onPress={onEdit}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          color: transactionColors.textPrimary,
                          fontWeight: "500",
                        }}
                      >
                        Editar
                      </Text>
                    </TouchableOpacity>
                  )}

                  {onDelete && (
                    <TouchableOpacity
                      style={{
                        paddingHorizontal: 16,
                        paddingVertical: 12,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                      }}
                      onPress={onDelete}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          color: colors.destructive[isDark ? "dark" : "light"],
                          fontWeight: "500",
                        }}
                      >
                        Excluir
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </>
            )}
          </View>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              paddingBottom: 4,
              color:
                transaction.transaction_type === "deposit"
                  ? transactionColors.depositText
                  : transactionColors.withdrawalText,
            }}
          >
            {getAmountPrefix(transaction.transaction_type)}
            {formatAmount(MoneyUtils.centsToReais(transaction.amount))}
          </Text>

          {/* Botões de processo para transações pendentes */}
          {onProcess && transaction.status === "pending" && (
            <View style={{ flexDirection: "row", marginTop: 8, gap: 8 }}>
              <TouchableOpacity
                style={{
                  padding: 6,
                  borderRadius: 4,
                  backgroundColor: colors.charts.main.green + "20",
                }}
                onPress={() => onProcess("complete")}
              >
                <Text
                  style={{
                    color: colors.charts.main.green,
                    fontSize: 12,
                    fontWeight: "600",
                  }}
                >
                  ✓ Concluir
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  padding: 6,
                  borderRadius: 4,
                  backgroundColor:
                    colors.destructive[isDark ? "dark" : "light"] + "20",
                }}
                onPress={() => onProcess("fail")}
              >
                <Text
                  style={{
                    color: colors.destructive[isDark ? "dark" : "light"],
                    fontSize: 12,
                    fontWeight: "600",
                  }}
                >
                  ✗ Falhar
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
