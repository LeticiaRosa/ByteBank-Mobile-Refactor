/**
 * Infrastructure Layer - Transaction Form Adapter
 * Adapta hooks e gerencia lógica do formulário de transação
 * Isola implementações técnicas da camada de apresentação
 */

import { useState, useEffect } from "react";
import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useTheme } from "../../hooks/useTheme";
import { useToast } from "../../hooks/useToast";
import { MoneyUtils } from "../../utils/money.utils";
import type { BankAccount } from "../../hooks/useAuth";
import type {
  CreateTransactionData,
  Transaction,
} from "../../lib/transactions";
import type {
  TransactionFormData,
  TransactionFormErrors,
  TransactionFormState,
  TransactionFormActions,
} from "../../domain/transaction-form/TransactionFormState";

export interface TransactionFormAdapter {
  state: TransactionFormState;
  actions: TransactionFormActions;
  theme: {
    isDark: boolean;
    colors: {
      background: string;
      cardBackground: string;
      border: string;
      text: string;
      textSecondary: string;
      primary: string;
      error: string;
      placeholder: string;
      highlight: string;
      inputBackground: string;
    };
  };
}

interface UseTransactionFormAdapterProps {
  primaryAccount: BankAccount | null | undefined;
  bankAccounts: BankAccount[] | undefined;
  isCreating: boolean;
  onCreateTransaction: (data: CreateTransactionData) => Promise<any>;
  isEditing?: boolean;
  editingTransaction?: Transaction | null;
  isUpdating?: boolean;
  onUpdateTransaction?: (
    transactionId: string,
    data: Partial<CreateTransactionData>
  ) => Promise<any>;
  onCancelEdit?: () => void;
}

export function useTransactionFormAdapter({
  primaryAccount,
  bankAccounts,
  isCreating,
  onCreateTransaction,
  isEditing = false,
  editingTransaction = null,
  isUpdating = false,
  onUpdateTransaction,
  onCancelEdit,
}: UseTransactionFormAdapterProps): TransactionFormAdapter {
  const { isDark } = useTheme();
  const { showInfo, showError, validationError, transactionError } = useToast();

  // Função para encontrar conta por ID
  const findAccountById = (accountId?: string) => {
    if (!accountId) return null;
    return bankAccounts?.find((account) => account.id === accountId);
  };

  // Função para inicializar dados do formulário
  const getInitialFormData = (): TransactionFormData => {
    if (isEditing && editingTransaction) {
      const toAccount = findAccountById(editingTransaction.to_account_id);
      const amount = editingTransaction.amount;
      return {
        transaction_type: editingTransaction.transaction_type,
        amount: amount.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
        description: editingTransaction.description || "",
        to_account_number: toAccount?.account_number || "",
        category: editingTransaction.category || "outros",
        sender_name: editingTransaction.sender_name || "",
        receipt_file: null,
      };
    }

    return {
      transaction_type: "deposit",
      amount: "",
      description: "",
      to_account_number: "",
      category: "outros",
      sender_name: "",
      receipt_file: null,
    };
  };

  // Estado do formulário
  const [formData, setFormData] = useState<TransactionFormData>(
    getInitialFormData()
  );
  const [errors, setErrors] = useState<TransactionFormErrors>({});
  const [typeModalVisible, setTypeModalVisible] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);

  // Atualizar formulário quando transação em edição mudar
  useEffect(() => {
    setFormData(getInitialFormData());
    setErrors({});
  }, [editingTransaction, isEditing]);

  // Cores dinâmicas
  const colors = {
    background: isDark ? "#1f1f1f" : "#ffffff",
    cardBackground: isDark ? "#2d2d2d" : "#f8f8f8",
    border: isDark ? "#3d3d3d" : "#e5e5e5",
    text: isDark ? "#f0f0f0" : "#202020",
    textSecondary: isDark ? "#b0b0b0" : "#505050",
    primary: "#0284c7",
    error: "#ef4444",
    placeholder: isDark ? "#6b6b6b" : "#a0a0a0",
    highlight: isDark ? "#3b82f6" : "#60a5fa",
    inputBackground: isDark ? "#3a3a3a" : "#ffffff",
  };

  // Validação do formulário
  const validateForm = (): boolean => {
    const newErrors: TransactionFormErrors = {};

    const amountInCents = MoneyUtils.parseCurrencyToCents(formData.amount);
    const amount = MoneyUtils.centsToReais(amountInCents);
    if (!formData.amount || amount <= 0) {
      newErrors.amount = "Valor deve ser um número positivo";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Descrição é obrigatória";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Formatação de moeda
  const formatCurrency = (value: string): string => {
    const cleanValue = value.replace(/\D/g, "");
    const numberValue = parseInt(cleanValue || "0") / 100;
    return numberValue.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  // Handler para mudança de valor
  const handleAmountChange = (value: string) => {
    const formatted = formatCurrency(value);
    setFormData((prev) => ({ ...prev, amount: formatted }));
    if (errors.amount) {
      setErrors((prev) => ({ ...prev, amount: undefined }));
    }
  };

  // Handler para mudança de inputs
  const handleInputChange = (
    field: keyof TransactionFormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof TransactionFormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Buscar conta por número
  const findAccountByNumber = (accountNumber: string) => {
    return bankAccounts?.find(
      (account) => account.account_number === accountNumber
    );
  };

  // Picker de imagem
  const handleImagePick = async () => {
    Alert.alert("Selecionar Comprovante", "Escolha uma opção:", [
      { text: "Cancelar", style: "cancel" },
      { text: "Câmera", onPress: () => handleCameraPick() },
      { text: "Galeria", onPress: () => handleLibraryPick() },
    ]);
  };

  const handleCameraPick = async () => {
    try {
      const cameraPermission =
        await ImagePicker.requestCameraPermissionsAsync();
      if (!cameraPermission.granted) {
        showInfo({
          title: "Permissão necessária",
          message: "Precisamos da permissão para acessar sua câmera.",
        });
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
        exif: false,
        base64: false,
        selectionLimit: 1,
        preferredAssetRepresentationMode:
          ImagePicker.UIImagePickerPreferredAssetRepresentationMode.Compatible,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const fileSizeKB = asset.fileSize ? asset.fileSize / 1024 : 0;

        if (fileSizeKB > 5000) {
          showInfo({
            title: "Arquivo muito grande",
            message:
              "Por favor, tire uma foto com menor resolução ou use uma imagem menor que 5MB.",
          });
          return;
        }

        setFormData((prev) => ({ ...prev, receipt_file: asset }));
        showInfo({
          title: "Foto capturada",
          message: "Comprovante adicionado com sucesso!",
        });
      }
    } catch (error) {
      console.error("Erro ao tirar foto:", error);
      showError({
        title: "Erro na câmera",
        message:
          "Não foi possível tirar a foto. Verifique as permissões e tente novamente.",
      });
    }
  };

  const handleLibraryPick = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        showInfo({
          title: "Permissão necessária",
          message:
            "Precisamos da permissão para acessar sua biblioteca de imagens.",
        });
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
        exif: false,
        base64: false,
        selectionLimit: 1,
        preferredAssetRepresentationMode:
          ImagePicker.UIImagePickerPreferredAssetRepresentationMode.Compatible,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const fileSizeKB = asset.fileSize ? asset.fileSize / 1024 : 0;

        if (fileSizeKB > 5000) {
          showInfo({
            title: "Arquivo muito grande",
            message:
              "Por favor, selecione uma imagem menor que 5MB ou edite-a para reduzir o tamanho.",
          });
          return;
        }

        setFormData((prev) => ({ ...prev, receipt_file: asset }));
        showInfo({
          title: "Imagem selecionada",
          message: "Comprovante adicionado com sucesso!",
        });
      }
    } catch (error) {
      console.error("Erro ao selecionar imagem:", error);
      showError({
        title: "Erro na galeria",
        message:
          "Não foi possível selecionar a imagem. Verifique as permissões e tente novamente.",
      });
    }
  };

  const removeReceiptFile = () => {
    setFormData((prev) => ({ ...prev, receipt_file: null }));
  };

  // Submit do formulário
  const handleSubmit = () => {
    if (!validateForm()) {
      validationError("Verifique os campos obrigatórios");
      return;
    }

    if (!primaryAccount) {
      showError({
        title: "Conta Bancária",
        message: "Nenhuma conta bancária encontrada!",
      });
      return;
    }

    try {
      const amountInCents = MoneyUtils.parseCurrencyToCents(formData.amount);
      const amount = MoneyUtils.centsToReais(amountInCents);

      const transactionData: CreateTransactionData = {
        transaction_type: formData.transaction_type,
        amount,
        description: formData.description,
        from_account_id: primaryAccount.id,
        category: formData.category,
        sender_name: formData.sender_name.trim() || undefined,
        receipt_file: formData.receipt_file || undefined,
      };

      if (
        formData.transaction_type === "transfer" &&
        formData.to_account_number
      ) {
        const toAccount = findAccountByNumber(formData.to_account_number);
        if (!toAccount) {
          showError({
            title: "Conta não encontrada",
            message: "A conta de destino informada não foi encontrada",
          });
          return;
        }
        transactionData.to_account_id = toAccount.id;
      }

      if (isEditing && editingTransaction && onUpdateTransaction) {
        onUpdateTransaction(editingTransaction.id, transactionData)
          .then(() => {
            if (onCancelEdit) onCancelEdit();
          })
          .catch((error) => {
            console.error("Erro ao atualizar transação:", error);
            transactionError(
              "Não foi possível atualizar a transação. Tente novamente."
            );
          });
      } else {
        onCreateTransaction(transactionData)
          .then(() => {
            setFormData({
              transaction_type: "deposit",
              amount: "",
              description: "",
              to_account_number: "",
              category: "outros",
              sender_name: "",
              receipt_file: null,
            });
            setErrors({});
          })
          .catch((error) => {
            console.error("Erro ao criar transação:", error);
            if (
              error.message &&
              error.message.includes("Network request failed")
            ) {
              showError({
                title: "Problema de Conectividade",
                message:
                  "A transação foi criada, mas houve problema no upload do comprovante.",
                duration: 8000,
              });
            } else if (error.message && error.message.includes("upload")) {
              showError({
                title: "Erro no Upload",
                message:
                  "A transação foi criada com sucesso, mas não foi possível anexar o comprovante.",
                duration: 6000,
              });
            } else {
              transactionError(
                "Não foi possível criar a transação. Tente novamente."
              );
            }
          });
      }
    } catch (error) {
      console.error("Erro ao processar transação:", error);
      transactionError(
        "Ocorreu um erro ao processar a transação. Tente novamente."
      );
    }
  };

  const state: TransactionFormState = {
    formData,
    errors,
    typeModalVisible,
    categoryModalVisible,
    isLoading: isCreating || isUpdating,
  };

  const actions: TransactionFormActions = {
    handleInputChange,
    handleAmountChange,
    handleSubmit,
    handleImagePick,
    handleCameraPick,
    handleLibraryPick,
    removeReceiptFile,
    setTypeModalVisible,
    setCategoryModalVisible,
  };

  return {
    state,
    actions,
    theme: { isDark, colors },
  };
}
