/**
 * Presentation Layer - ExtractFilters View
 *
 * Componente visual stateless para renderizar filtros.
 */

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useTheme } from "../../../hooks/useTheme";
import { getTheme, getColorScale } from "../../../styles/theme";
import type { FilterOptions } from "../../../domain/extrato/ExtratoState";
import { EXTRATO_CONSTANTS } from "../../../domain/extrato/ExtratoState";
import type {
  FiltersModalState,
  FiltersActions,
} from "../../../domain/extrato/FiltersState";
import { FILTER_OPTIONS } from "../../../domain/extrato/FiltersState";

const { TRANSACTION_CATEGORIES } = EXTRATO_CONSTANTS;
const { TRANSACTION_TYPES, STATUS_OPTIONS } = FILTER_OPTIONS;

interface ExtractFiltersViewProps {
  filters: FilterOptions;
  isExpanded: boolean;
  modalsState: FiltersModalState;
  actions: FiltersActions;
  formatDisplayDate: (dateString: string) => string;
}

export function ExtractFiltersView({
  filters,
  isExpanded,
  modalsState,
  actions,
  formatDisplayDate,
}: ExtractFiltersViewProps) {
  const { isDark } = useTheme();
  const dynamicStyles = createStyles(isDark);
  const colorScale = getColorScale(isDark);
  const placeholderColor = colorScale.gray[10];

  // Componente para renderizar um selector customizado
  const CustomSelect = ({
    label,
    value,
    placeholder,
    options,
    onOpen,
  }: {
    label: string;
    value: string;
    placeholder: string;
    options: readonly { value: string; label: string }[];
    onOpen: () => void;
  }) => {
    const selectedOption = options.find((opt) => opt.value === value);
    const displayValue = selectedOption ? selectedOption.label : placeholder;

    return (
      <View style={dynamicStyles.formGroup}>
        <Text style={dynamicStyles.label}>{label}</Text>
        <TouchableOpacity style={dynamicStyles.selectTrigger} onPress={onOpen}>
          <Text
            style={[
              dynamicStyles.selectValue,
              value === "all" || !value ? dynamicStyles.placeholderText : {},
            ]}
          >
            {displayValue}
          </Text>
          <Text style={dynamicStyles.selectIcon}>▼</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Modal para seleção de opções
  const SelectModal = ({
    visible,
    title,
    options,
    onSelect,
    onClose,
  }: {
    visible: boolean;
    title: string;
    options: readonly { value: string; label: string }[];
    onSelect: (value: string) => void;
    onClose: () => void;
  }) => (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={dynamicStyles.modalOverlay}>
        <View style={dynamicStyles.modalContent}>
          <Text style={dynamicStyles.modalTitle}>{title}</Text>
          <ScrollView>
            {options.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={dynamicStyles.modalOption}
                onPress={() => {
                  onSelect(option.value);
                  onClose();
                }}
              >
                <Text style={dynamicStyles.modalOptionText}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity
            style={dynamicStyles.modalCloseButton}
            onPress={onClose}
          >
            <Text style={dynamicStyles.modalCloseButtonText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={dynamicStyles.card}>
      <View style={dynamicStyles.cardContent}>
        <View style={dynamicStyles.filtersContainer}>
          {/* Campo de busca */}
          <View style={dynamicStyles.searchRow}>
            <View style={dynamicStyles.searchInputContainer}>
              <TextInput
                style={dynamicStyles.input}
                placeholder="Buscar por descrição..."
                placeholderTextColor={placeholderColor}
                value={filters.description}
                onChangeText={(text) =>
                  actions.onFilterChange("description", text)
                }
              />
            </View>
          </View>

          {/* Filtros rápidos */}
          <View style={dynamicStyles.quickFiltersRow}>
            <TouchableOpacity
              style={dynamicStyles.outlineButton}
              onPress={() => actions.onApplyQuickFilter(7)}
            >
              <Text style={dynamicStyles.buttonText}>Últimos 7 dias</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={dynamicStyles.outlineButton}
              onPress={() => actions.onApplyQuickFilter(30)}
            >
              <Text style={dynamicStyles.buttonText}>Últimos 30 dias</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={dynamicStyles.outlineButton}
              onPress={() => actions.onApplyQuickFilter(90)}
            >
              <Text style={dynamicStyles.buttonText}>Últimos 90 dias</Text>
            </TouchableOpacity>
          </View>

          <View style={dynamicStyles.buttonRow}>
            <TouchableOpacity
              style={dynamicStyles.outlineButton}
              onPress={actions.onToggleExpanded}
            >
              <Text style={dynamicStyles.buttonText}>
                {isExpanded ? "Menos Filtros" : "Mais Filtros"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={dynamicStyles.outlineButton}
              onPress={actions.onReset}
            >
              <Text style={dynamicStyles.buttonText}>Limpar</Text>
            </TouchableOpacity>
          </View>

          {/* Filtros expandidos */}
          {isExpanded && (
            <ScrollView
              style={dynamicStyles.expandedFilters}
              contentContainerStyle={dynamicStyles.expandedFiltersContent}
            >
              {/* Date pickers */}
              <View style={dynamicStyles.formGroup}>
                <Text style={dynamicStyles.label}>Data inicial</Text>
                <TouchableOpacity
                  style={dynamicStyles.datePicker}
                  onPress={() => actions.onToggleModal("showDateFromPicker")}
                >
                  <Text
                    style={
                      filters.dateFrom
                        ? dynamicStyles.dateText
                        : dynamicStyles.placeholderText
                    }
                  >
                    {filters.dateFrom
                      ? formatDisplayDate(filters.dateFrom)
                      : "Selecionar data inicial"}
                  </Text>
                </TouchableOpacity>
                {modalsState.showDateFromPicker && (
                  <DateTimePicker
                    value={
                      filters.dateFrom ? new Date(filters.dateFrom) : new Date()
                    }
                    mode="date"
                    display="default"
                    onChange={(event, date) =>
                      actions.onDateChange(date, "dateFrom")
                    }
                    maximumDate={new Date()}
                  />
                )}
              </View>

              <View style={dynamicStyles.formGroup}>
                <Text style={dynamicStyles.label}>Data final</Text>
                <TouchableOpacity
                  style={dynamicStyles.datePicker}
                  onPress={() => actions.onToggleModal("showDateToPicker")}
                >
                  <Text
                    style={
                      filters.dateTo
                        ? dynamicStyles.dateText
                        : dynamicStyles.placeholderText
                    }
                  >
                    {filters.dateTo
                      ? formatDisplayDate(filters.dateTo)
                      : "Selecionar data final"}
                  </Text>
                </TouchableOpacity>
                {modalsState.showDateToPicker && (
                  <DateTimePicker
                    value={
                      filters.dateTo ? new Date(filters.dateTo) : new Date()
                    }
                    mode="date"
                    display="default"
                    onChange={(event, date) =>
                      actions.onDateChange(date, "dateTo")
                    }
                    maximumDate={new Date()}
                  />
                )}
              </View>

              {/* Tipo de transação */}
              <CustomSelect
                label="Tipo"
                value={filters.transactionType}
                placeholder="Todos os tipos"
                options={TRANSACTION_TYPES}
                onOpen={() => actions.onToggleModal("showTransactionTypeModal")}
              />

              {/* Status */}
              <CustomSelect
                label="Status"
                value={filters.status}
                placeholder="Todos os status"
                options={STATUS_OPTIONS}
                onOpen={() => actions.onToggleModal("showStatusModal")}
              />

              {/* Categoria */}
              <CustomSelect
                label="Categoria"
                value={filters.category}
                placeholder="Todas as categorias"
                options={TRANSACTION_CATEGORIES}
                onOpen={() => actions.onToggleModal("showCategoryModal")}
              />

              {/* Remetente */}
              <View style={dynamicStyles.formGroup}>
                <Text style={dynamicStyles.label}>Remetente</Text>
                <TextInput
                  style={dynamicStyles.input}
                  placeholder="Nome do remetente..."
                  placeholderTextColor={placeholderColor}
                  value={filters.senderName}
                  onChangeText={(text) =>
                    actions.onFilterChange("senderName", text)
                  }
                />
              </View>

              {/* Valor mínimo */}
              <View style={dynamicStyles.formGroup}>
                <Text style={dynamicStyles.label}>Valor mínimo</Text>
                <TextInput
                  style={dynamicStyles.input}
                  placeholder="R$ 0,00"
                  placeholderTextColor={placeholderColor}
                  value={filters.minAmount}
                  keyboardType="numeric"
                  onChangeText={(text) =>
                    actions.onFilterChange("minAmount", text)
                  }
                />
              </View>

              {/* Valor máximo */}
              <View style={dynamicStyles.formGroup}>
                <Text style={dynamicStyles.label}>Valor máximo</Text>
                <TextInput
                  style={dynamicStyles.input}
                  placeholder="R$ 0,00"
                  placeholderTextColor={placeholderColor}
                  value={filters.maxAmount}
                  keyboardType="numeric"
                  onChangeText={(text) =>
                    actions.onFilterChange("maxAmount", text)
                  }
                />
              </View>
            </ScrollView>
          )}
        </View>
      </View>

      {/* Modais de seleção */}
      <SelectModal
        visible={modalsState.showTransactionTypeModal}
        title="Selecione o tipo de transação"
        options={TRANSACTION_TYPES}
        onSelect={(value) => actions.onFilterChange("transactionType", value)}
        onClose={() => actions.onToggleModal("showTransactionTypeModal")}
      />

      <SelectModal
        visible={modalsState.showStatusModal}
        title="Selecione o status"
        options={STATUS_OPTIONS}
        onSelect={(value) => actions.onFilterChange("status", value)}
        onClose={() => actions.onToggleModal("showStatusModal")}
      />

      <SelectModal
        visible={modalsState.showCategoryModal}
        title="Selecione a categoria"
        options={TRANSACTION_CATEGORIES}
        onSelect={(value) => actions.onFilterChange("category", value)}
        onClose={() => actions.onToggleModal("showCategoryModal")}
      />
    </View>
  );
}

// Função para criar estilos dinâmicos baseados no tema
const createStyles = (isDark: boolean) => {
  const theme = getTheme(isDark);
  const colorScale = getColorScale(isDark);

  const backgroundColor = theme.card;
  const borderColor = theme.border;
  const textPrimary = theme.foreground;
  const textSecondary = colorScale.gray[11];
  const textMuted = theme.mutedForeground;
  const placeholderColor = colorScale.gray[10];
  const inputBackground = colorScale.gray[2];
  const buttonBackground = "transparent";
  const modalBackground = theme.card;
  const modalOverlayColor = isDark ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0.5)";
  const separatorColor = theme.border;
  const closeBtnBackground = theme.muted;

  return StyleSheet.create({
    card: {
      backgroundColor,
      borderRadius: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: isDark ? 0.3 : 0.2,
      shadowRadius: 3,
      elevation: 3,
      marginBottom: 16,
    },
    cardContent: {
      padding: 16,
    },
    filtersContainer: {
      gap: 16,
    },
    searchRow: {
      flexDirection: "row",
      gap: 12,
      marginBottom: 8,
    },
    searchInputContainer: {
      flex: 1,
    },
    buttonRow: {
      flexDirection: "row",
      gap: 8,
      justifyContent: "flex-end",
    },
    quickFiltersRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      marginBottom: 8,
    },
    outlineButton: {
      paddingVertical: 8,
      paddingHorizontal: 8,
      borderWidth: 1,
      borderColor,
      borderRadius: 4,
      backgroundColor: buttonBackground,
    },
    buttonText: {
      color: textPrimary,
      fontSize: 12,
    },
    input: {
      height: 44,
      borderWidth: 1,
      borderColor,
      borderRadius: 4,
      paddingHorizontal: 12,
      fontSize: 16,
      backgroundColor: inputBackground,
      color: textPrimary,
    },
    expandedFilters: {
      maxHeight: 300,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: borderColor,
    },
    expandedFiltersContent: {
      gap: 16,
      paddingBottom: 16,
    },
    formGroup: {
      marginBottom: 12,
    },
    label: {
      fontSize: 14,
      fontWeight: "500",
      marginBottom: 4,
      color: textSecondary,
    },
    datePicker: {
      height: 44,
      borderWidth: 1,
      borderColor,
      borderRadius: 4,
      paddingHorizontal: 12,
      justifyContent: "center",
      backgroundColor: inputBackground,
    },
    dateText: {
      fontSize: 16,
      color: textPrimary,
    },
    placeholderText: {
      color: placeholderColor,
    },
    selectTrigger: {
      height: 44,
      borderWidth: 1,
      borderColor,
      borderRadius: 4,
      paddingHorizontal: 12,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: inputBackground,
    },
    selectValue: {
      fontSize: 16,
      color: textPrimary,
    },
    selectIcon: {
      fontSize: 12,
      color: textMuted,
    },
    modalOverlay: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: modalOverlayColor,
    },
    modalContent: {
      backgroundColor: modalBackground,
      borderRadius: 8,
      padding: 16,
      width: "80%",
      maxHeight: "70%",
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "600",
      marginBottom: 16,
      textAlign: "center",
      color: textPrimary,
    },
    modalOption: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: separatorColor,
    },
    modalOptionText: {
      fontSize: 16,
      color: textPrimary,
    },
    modalCloseButton: {
      marginTop: 16,
      paddingVertical: 12,
      backgroundColor: closeBtnBackground,
      borderRadius: 4,
      alignItems: "center",
    },
    modalCloseButtonText: {
      fontSize: 16,
      fontWeight: "500",
      color: textSecondary,
    },
    rowFlex: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
  });
};
