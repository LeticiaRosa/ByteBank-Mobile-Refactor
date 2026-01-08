/**
 * Domain Layer - Transaction Form State
 * Define os tipos e interfaces do domínio do formulário de transação
 * Camada independente de frameworks e bibliotecas
 */

import type { ImagePickerAsset } from "expo-image-picker";
import type { TransactionCategory } from "../../lib/transactions";

export interface TransactionFormData {
  transaction_type: "deposit" | "withdrawal" | "transfer" | "payment" | "fee";
  amount: string;
  description: string;
  to_account_number?: string;
  category: TransactionCategory;
  sender_name: string;
  receipt_file?: ImagePickerAsset | null;
}

export interface TransactionFormErrors {
  amount?: string;
  description?: string;
  to_account_number?: string;
}

export interface TransactionFormState {
  formData: TransactionFormData;
  errors: TransactionFormErrors;
  typeModalVisible: boolean;
  categoryModalVisible: boolean;
  isLoading: boolean;
}

export interface TransactionFormActions {
  handleInputChange: (field: keyof TransactionFormData, value: string) => void;
  handleAmountChange: (value: string) => void;
  handleSubmit: () => void;
  handleImagePick: () => void;
  handleCameraPick: () => void;
  handleLibraryPick: () => void;
  removeReceiptFile: () => void;
  setTypeModalVisible: (visible: boolean) => void;
  setCategoryModalVisible: (visible: boolean) => void;
}

export interface CategoryOption {
  label: string;
  value: TransactionCategory;
}

export interface TypeOption {
  label: string;
  value: "deposit" | "withdrawal" | "transfer" | "payment" | "fee";
}

// Categorias de transação
export const TRANSACTION_CATEGORIES: CategoryOption[] = [
  { label: "Alimentação", value: "alimentacao" },
  { label: "Transporte", value: "transporte" },
  { label: "Saúde", value: "saude" },
  { label: "Educação", value: "educacao" },
  { label: "Entretenimento", value: "entretenimento" },
  { label: "Compras", value: "compras" },
  { label: "Casa", value: "casa" },
  { label: "Trabalho", value: "trabalho" },
  { label: "Investimentos", value: "investimentos" },
  { label: "Viagem", value: "viagem" },
  { label: "Outros", value: "outros" },
];

// Tipos de transação
export const TRANSACTION_TYPES: TypeOption[] = [
  { label: "Depósito", value: "deposit" },
  { label: "Saque", value: "withdrawal" },
  { label: "Transferência", value: "transfer" },
  { label: "Pagamento", value: "payment" },
  { label: "Taxa", value: "fee" },
];
