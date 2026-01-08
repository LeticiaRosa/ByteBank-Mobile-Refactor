/**
 * Presentation Layer - Transaction Form View
 * Componente de apresentação puro (stateless)
 * Responsável apenas pela renderização visual do formulário
 * Segue o princípio de Responsabilidade Única (S do SOLID)
 */

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  ActivityIndicator,
  KeyboardAvoidingView,
  Image,
} from "react-native";
import {
  ArrowDown,
  ArrowUp,
  ArrowLeftRight,
  CreditCard,
  DollarSign,
  Upload,
  ShoppingBag,
  Car,
  Utensils,
  Heart,
  GraduationCap,
  Tv,
  Home,
  Briefcase,
  TrendingUp,
  Plane,
  MoreHorizontal,
  X,
} from "lucide-react-native";
import type {
  TransactionFormState,
  TransactionFormActions,
} from "../../domain/transaction-form/TransactionFormState";
import { TypeSelector, CategorySelector } from "./components/FormSelectors";

interface TransactionFormViewProps {
  state: TransactionFormState;
  actions: TransactionFormActions;
  colors: any;
  isDark: boolean;
  isEditing: boolean;
  editingTransaction: any;
  onCancelEdit?: () => void;
}

export function TransactionFormView({
  state,
  actions,
  colors,
  isDark,
  isEditing,
  editingTransaction,
  onCancelEdit,
}: TransactionFormViewProps) {
  const {
    formData,
    errors,
    typeModalVisible,
    categoryModalVisible,
    isLoading,
  } = state;
  const {
    handleInputChange,
    handleAmountChange,
    handleSubmit,
    handleImagePick,
    removeReceiptFile,
    setTypeModalVisible,
    setCategoryModalVisible,
  } = actions;
  console.log(formData.amount);
  // Ícone baseado no tipo de transação
  const getTransactionIcon = () => {
    switch (formData.transaction_type) {
      case "deposit":
        return <ArrowDown color={colors.primary} size={20} />;
      case "withdrawal":
        return <ArrowUp color={colors.primary} size={20} />;
      case "transfer":
        return <ArrowLeftRight color={colors.primary} size={20} />;
      case "payment":
        return <CreditCard color={colors.primary} size={20} />;
      case "fee":
        return <DollarSign color={colors.primary} size={20} />;
      default:
        return <DollarSign color={colors.primary} size={20} />;
    }
  };

  // Ícone baseado na categoria
  const getCategoryIcon = () => {
    switch (formData.category) {
      case "alimentacao":
        return <Utensils color={colors.primary} size={20} />;
      case "transporte":
        return <Car color={colors.primary} size={20} />;
      case "saude":
        return <Heart color={colors.primary} size={20} />;
      case "educacao":
        return <GraduationCap color={colors.primary} size={20} />;
      case "entretenimento":
        return <Tv color={colors.primary} size={20} />;
      case "compras":
        return <ShoppingBag color={colors.primary} size={20} />;
      case "casa":
        return <Home color={colors.primary} size={20} />;
      case "trabalho":
        return <Briefcase color={colors.primary} size={20} />;
      case "investimentos":
        return <TrendingUp color={colors.primary} size={20} />;
      case "viagem":
        return <Plane color={colors.primary} size={20} />;
      default:
        return <MoreHorizontal color={colors.primary} size={20} />;
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView style={styles.scrollContainer}>
        <View
          style={[
            styles.container,
            {
              backgroundColor: colors.cardBackground,
              borderColor: isEditing ? colors.highlight : colors.border,
            },
          ]}
        >
          {/* Cabeçalho */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>
              {isEditing ? "Editar Transação" : "Nova Transação"}
            </Text>
            {isEditing && onCancelEdit && (
              <TouchableOpacity
                onPress={onCancelEdit}
                style={styles.cancelButton}
              >
                <Text style={{ color: colors.textSecondary }}>Cancelar</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Indicador de edição */}
          {isEditing && editingTransaction && (
            <View
              style={[
                styles.editingIndicator,
                {
                  backgroundColor: isDark ? "#172554" : "#dbeafe",
                  borderColor: isDark ? "#2563eb" : "#93c5fd",
                },
              ]}
            >
              <Text
                style={[
                  styles.editingText,
                  { color: isDark ? "#bfdbfe" : "#1e40af" },
                ]}
              >
                <Text style={styles.boldText}>Editando transação: </Text>
                {editingTransaction.id.slice(-8)}
              </Text>
            </View>
          )}

          {/* Tipo de Transação */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>
              Tipo de Transação *
            </Text>
            <TypeSelector
              value={formData.transaction_type}
              onSelect={(value) => handleInputChange("transaction_type", value)}
              getIcon={getTransactionIcon}
              colors={colors}
              modalVisible={typeModalVisible}
              setModalVisible={setTypeModalVisible}
            />
          </View>

          {/* Valor */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Valor *</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.inputBackground,
                  borderColor: errors.amount ? colors.error : colors.border,
                  color: colors.text,
                },
              ]}
              value={formData.amount}
              onChangeText={handleAmountChange}
              placeholder="R$ 0,00"
              placeholderTextColor={colors.placeholder}
              keyboardType="numeric"
              maxLength={13}
            />
            {errors.amount && (
              <Text style={styles.errorText}>{errors.amount}</Text>
            )}
          </View>

          {/* Conta de Destino (apenas para transferências) */}
          {formData.transaction_type === "transfer" && (
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>
                Conta de Destino
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.inputBackground,
                    borderColor: errors.to_account_number
                      ? colors.error
                      : colors.border,
                    color: colors.text,
                  },
                ]}
                value={formData.to_account_number || ""}
                onChangeText={(text) =>
                  handleInputChange("to_account_number", text)
                }
                placeholder="Digite o número da conta (opcional)"
                placeholderTextColor={colors.placeholder}
                keyboardType="numeric"
              />
              {errors.to_account_number && (
                <Text style={styles.errorText}>{errors.to_account_number}</Text>
              )}
            </View>
          )}

          {/* Categoria */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>
              Categoria *
            </Text>
            <CategorySelector
              value={formData.category}
              onSelect={(value) => handleInputChange("category", value)}
              getIcon={getCategoryIcon}
              colors={colors}
              modalVisible={categoryModalVisible}
              setModalVisible={setCategoryModalVisible}
            />
          </View>

          {/* Remetente/Pagador */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>
              Remetente/Pagador
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.inputBackground,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              value={formData.sender_name}
              onChangeText={(text) => handleInputChange("sender_name", text)}
              placeholder="Nome do remetente ou pagador (opcional)"
              placeholderTextColor={colors.placeholder}
            />
          </View>

          {/* Descrição */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>
              Descrição *
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.inputBackground,
                  borderColor: errors.description
                    ? colors.error
                    : colors.border,
                  color: colors.text,
                },
              ]}
              value={formData.description}
              onChangeText={(text) => handleInputChange("description", text)}
              placeholder="Motivo da transação"
              placeholderTextColor={colors.placeholder}
            />
            {errors.description && (
              <Text style={styles.errorText}>{errors.description}</Text>
            )}
          </View>

          {/* Comprovante de Pagamento */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>
              Comprovante de Pagamento
            </Text>
            <TouchableOpacity
              style={[
                styles.fileUploadContainer,
                {
                  backgroundColor: colors.inputBackground,
                  borderColor: colors.border,
                },
              ]}
              onPress={handleImagePick}
              disabled={isLoading}
            >
              {!formData.receipt_file ? (
                <View style={styles.fileUploadContent}>
                  <Upload color={colors.primary} size={24} />
                  <Text
                    style={[
                      styles.fileUploadText,
                      { color: colors.textSecondary },
                    ]}
                  >
                    Selecione o comprovante de pagamento
                  </Text>
                </View>
              ) : (
                <View style={styles.fileUploadContent}>
                  <Image
                    source={{ uri: formData.receipt_file.uri }}
                    style={styles.receiptThumbnail}
                  />
                  <Text style={[styles.fileUploadText, { color: colors.text }]}>
                    Comprovante selecionado
                  </Text>
                  <TouchableOpacity
                    onPress={removeReceiptFile}
                    style={styles.removeFileButton}
                  >
                    <X color={colors.text} size={16} />
                  </TouchableOpacity>
                </View>
              )}
            </TouchableOpacity>
            <Text style={[styles.helperText, { color: colors.textSecondary }]}>
              Anexe uma foto do comprovante para facilitar o controle das suas
              transações
            </Text>
          </View>

          {/* Botão de Submissão */}
          <TouchableOpacity
            style={[styles.submitButton, isLoading && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitButtonText}>
                {isEditing ? "Atualizar Transação" : "Efetuar Transação"}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { flex: 1 },
  container: { borderRadius: 8, borderWidth: 1, padding: 16, margin: 16 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: { fontSize: 20, fontWeight: "600" },
  cancelButton: { padding: 8 },
  editingIndicator: {
    marginBottom: 16,
    padding: 12,
    borderWidth: 1,
    borderRadius: 6,
  },
  editingText: { fontSize: 14 },
  boldText: { fontWeight: "bold" },
  inputContainer: { marginBottom: 16 },
  label: { marginBottom: 8, fontSize: 14, fontWeight: "500" },
  input: { height: 48, borderWidth: 1, borderRadius: 6, paddingHorizontal: 12 },
  errorText: { color: "#ef4444", fontSize: 12, marginTop: 4 },
  fileUploadContainer: {
    borderWidth: 1,
    borderRadius: 6,
    borderStyle: "dashed",
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  fileUploadContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  fileUploadText: { marginLeft: 8 },
  receiptThumbnail: { width: 40, height: 40, borderRadius: 4, marginRight: 8 },
  removeFileButton: { marginLeft: 8, padding: 4 },
  helperText: { fontSize: 12, marginTop: 4 },
  submitButton: {
    backgroundColor: "#0284c7",
    height: 48,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  disabledButton: { opacity: 0.5 },
  submitButtonText: { color: "white", fontWeight: "600" },
});
