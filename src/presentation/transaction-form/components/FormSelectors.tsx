/**
 * Presentation Layer - Transaction Form View Components
 * Componentes visuais puros para o formulário de transação
 */

import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
} from "react-native";
import { ChevronDown, Check, X } from "lucide-react-native";
import {
  TRANSACTION_TYPES,
  TRANSACTION_CATEGORIES,
  type TypeOption,
  type CategoryOption,
} from "../../../domain/transaction-form/TransactionFormState";

// Componente de seleção de tipo de transação
interface TypeSelectorProps {
  value: string;
  onSelect: (value: string) => void;
  getIcon: () => React.ReactNode;
  colors: any;
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
}

export function TypeSelector({
  value,
  onSelect,
  getIcon,
  colors,
  modalVisible,
  setModalVisible,
}: TypeSelectorProps) {
  return (
    <>
      <TouchableOpacity
        style={[
          styles.selectButton,
          {
            backgroundColor: colors.inputBackground,
            borderColor: colors.border,
          },
        ]}
        onPress={() => setModalVisible(true)}
      >
        <View style={styles.selectContent}>
          {getIcon()}
          <Text style={[styles.selectText, { color: colors.text }]}>
            {TRANSACTION_TYPES.find((t) => t.value === value)?.label ||
              "Selecione o tipo"}
          </Text>
        </View>
        <ChevronDown color={colors.text} size={20} />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: colors.background },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Tipo de Transação
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X color={colors.text} size={24} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalList}>
              {TRANSACTION_TYPES.map((type: TypeOption) => (
                <TouchableOpacity
                  key={type.value}
                  style={[
                    styles.modalItem,
                    value === type.value && {
                      backgroundColor:
                        colors.inputBackground === "#3a3a3a"
                          ? "#374151"
                          : "#e5e7eb",
                    },
                  ]}
                  onPress={() => {
                    onSelect(type.value);
                    setModalVisible(false);
                  }}
                >
                  <Text style={[styles.modalItemText, { color: colors.text }]}>
                    {type.label}
                  </Text>
                  {value === type.value && (
                    <Check color={colors.primary} size={20} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

// Componente de seleção de categoria
interface CategorySelectorProps {
  value: string;
  onSelect: (value: string) => void;
  getIcon: () => React.ReactNode;
  colors: any;
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
}

export function CategorySelector({
  value,
  onSelect,
  getIcon,
  colors,
  modalVisible,
  setModalVisible,
}: CategorySelectorProps) {
  return (
    <>
      <TouchableOpacity
        style={[
          styles.selectButton,
          {
            backgroundColor: colors.inputBackground,
            borderColor: colors.border,
          },
        ]}
        onPress={() => setModalVisible(true)}
      >
        <View style={styles.selectContent}>
          {getIcon()}
          <Text style={[styles.selectText, { color: colors.text }]}>
            {TRANSACTION_CATEGORIES.find((c) => c.value === value)?.label ||
              "Selecione a categoria"}
          </Text>
        </View>
        <ChevronDown color={colors.text} size={20} />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: colors.background },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Categoria
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X color={colors.text} size={24} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalList}>
              {TRANSACTION_CATEGORIES.map((category: CategoryOption) => (
                <TouchableOpacity
                  key={category.value}
                  style={[
                    styles.modalItem,
                    value === category.value && {
                      backgroundColor:
                        colors.inputBackground === "#3a3a3a"
                          ? "#374151"
                          : "#e5e7eb",
                    },
                  ]}
                  onPress={() => {
                    onSelect(category.value);
                    setModalVisible(false);
                  }}
                >
                  <Text style={[styles.modalItemText, { color: colors.text }]}>
                    {category.label}
                  </Text>
                  {value === category.value && (
                    <Check color={colors.primary} size={20} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  selectButton: {
    height: 48,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  selectText: {
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 8,
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  modalList: {
    marginBottom: 16,
  },
  modalItem: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginBottom: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalItemText: {
    fontSize: 16,
  },
});
