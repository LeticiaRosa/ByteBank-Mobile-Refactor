/**
 * Presentation Layer - Extrato View
 *
 * Componente visual stateless que renderiza a interface do extrato.
 * Recebe todo o estado e ações via props.
 */

import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  FlatList,
  Modal,
} from "react-native";
import { getTheme } from "../../styles/theme";
import { ConfirmDeleteModal } from "../../components/ui/ConfirmDeleteModal";
import { TransactionForm } from "../transaction-form/TransactionForm";
import {
  TransactionItem,
  ExtractFilters,
  SimplePagination,
} from "./components";
import type {
  ExtratoState,
  ExtratoActions,
  FilterOptions,
} from "../../domain/extrato/ExtratoState";
import type { Transaction } from "../../lib/transactions";
import type { BankAccount } from "../../hooks/useAuth";
import { EXTRATO_CONSTANTS } from "../../domain/extrato/ExtratoState";

const { PAGE_SIZE } = EXTRATO_CONSTANTS;

interface ExtratoViewProps {
  state: ExtratoState;
  actions: ExtratoActions;
  filters: FilterOptions;
  bankAccounts: BankAccount[] | undefined;
  primaryAccount: BankAccount | null;
  isUpdating: boolean;
}

export function ExtratoView({
  state,
  actions,
  filters,
  bankAccounts,
  primaryAccount,
  isUpdating,
}: ExtratoViewProps) {
  const {
    isDark,
    transactions,
    isLoading,
    paginationInfo,
    deleteModal,
    editModal,
    currentPage,
  } = state;
  const dynamicStyles = createStyles(isDark);
  const theme = getTheme(isDark);

  const renderHeader = () => (
    <View>
      <Text style={dynamicStyles.headerTitle}>Extrato</Text>
      <Text style={dynamicStyles.headerSubtitle}>
        Acompanhe todas as suas transações financeiras
      </Text>
    </View>
  );

  const renderCardHeader = () => (
    <View style={dynamicStyles.cardHeader}>
      <View style={dynamicStyles.cardTitleContainer}>
        <Text style={dynamicStyles.cardTitle}>Transações</Text>
        {!isLoading && paginationInfo && (
          <Text style={dynamicStyles.cardSubtitle}>
            ({paginationInfo.total || transactions.length}{" "}
            {(paginationInfo.total || transactions.length) === 1
              ? "item"
              : "itens"}
            {paginationInfo.total && paginationInfo.total > PAGE_SIZE && (
              <>
                {" • Página " +
                  currentPage +
                  " de " +
                  Math.ceil(paginationInfo.total / PAGE_SIZE)}
              </>
            )}
            )
          </Text>
        )}
      </View>
    </View>
  );

  const renderLoading = () => (
    <View style={dynamicStyles.loadingContainer}>
      <ActivityIndicator size="large" color={theme.primary} />
      <Text style={dynamicStyles.loadingText}>Carregando transações...</Text>
    </View>
  );

  const renderError = () => (
    <View style={dynamicStyles.emptyContainer}>
      <Text style={dynamicStyles.emptyTitle}>Erro ao carregar transações</Text>
      <Text style={dynamicStyles.emptyText}>
        Ocorreu um erro ao buscar as transações. Tente novamente.
      </Text>
    </View>
  );

  const renderEmptyList = () => (
    <View style={dynamicStyles.emptyContainer}>
      <Text style={dynamicStyles.emptyTitle}>Nenhuma transação encontrada</Text>
      <Text style={dynamicStyles.emptyText}>
        {state.hasActiveFilters
          ? "Tente ajustar os filtros para encontrar mais transações."
          : "Suas transações aparecerão aqui quando você começar a usar sua conta."}
      </Text>
    </View>
  );

  const renderItem = ({ item }: { item: Transaction }) => (
    <View style={dynamicStyles.transactionItemContainer}>
      <TransactionItem
        transaction={item}
        onEdit={actions.onEditTransaction}
        onDelete={actions.onDeleteTransaction}
        onProcess={actions.onProcessTransaction}
      />
    </View>
  );

  return (
    <View style={dynamicStyles.container}>
      {/* Header */}
      {renderHeader()}

      {/* Filtros */}
      <ExtractFilters
        onFilterChange={actions.onFilterChange}
        onReset={actions.onResetFilters}
      />

      {/* Lista de transações */}
      <View style={dynamicStyles.card}>
        {renderCardHeader()}

        <View style={dynamicStyles.cardContent}>
          {isLoading ? (
            renderLoading()
          ) : state.error && state.hasActiveFilters ? (
            renderError()
          ) : transactions.length === 0 ? (
            renderEmptyList()
          ) : (
            <FlatList
              data={transactions}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={dynamicStyles.listContent}
              showsVerticalScrollIndicator={true}
              ItemSeparatorComponent={() => (
                <View style={dynamicStyles.separator} />
              )}
            />
          )}

          {/* Paginação */}
          {!isLoading && transactions.length > 0 && paginationInfo && (
            <SimplePagination
              currentPage={currentPage}
              hasNextPage={paginationInfo.hasNextPage}
              hasPreviousPage={paginationInfo.hasPreviousPage}
              onPageChange={actions.onPageChange}
              itemCount={transactions.length}
              totalCount={paginationInfo.total || 0}
            />
          )}
        </View>
      </View>

      {/* Modal de Confirmação de Exclusão */}
      <ConfirmDeleteModal
        visible={deleteModal.visible}
        onConfirm={actions.onConfirmDelete}
        onCancel={actions.onCancelDelete}
        isDeleting={deleteModal.isDeleting}
        transactionId={deleteModal.transactionId}
      />

      {/* Modal de Edição */}
      <Modal
        visible={editModal.visible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={actions.onCloseEditModal}
      >
        <View style={dynamicStyles.modalContainer}>
          <TransactionForm
            primaryAccount={primaryAccount}
            bankAccounts={bankAccounts}
            isCreating={false}
            onCreateTransaction={async () => {}}
            isEditing={true}
            editingTransaction={editModal.transaction}
            isUpdating={isUpdating}
            onUpdateTransaction={actions.onUpdateTransaction}
            onCancelEdit={actions.onCloseEditModal}
          />
        </View>
      </Modal>
    </View>
  );
}

// Função para criar estilos dinâmicos baseados no tema
const createStyles = (isDark: boolean) => {
  const theme = getTheme(isDark);

  const backgroundColor = theme.background;
  const cardBackground = theme.card;
  const textPrimary = theme.foreground;
  const textSecondary = theme.mutedForeground;
  const borderColor = theme.border;

  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor,
      gap: 16,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: "700",
      color: textPrimary,
    },
    headerSubtitle: {
      fontSize: 14,
      color: textSecondary,
    },
    card: {
      backgroundColor: cardBackground,
      borderRadius: 8,
      shadowColor: isDark ? "#000" : "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.3 : 0.1,
      shadowRadius: 3,
      elevation: 3,
      marginBottom: 16,
      flex: 1,
    },
    cardHeader: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: borderColor,
    },
    cardTitleContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: textPrimary,
    },
    cardSubtitle: {
      marginLeft: 8,
      fontSize: 14,
      color: textSecondary,
      fontWeight: "normal",
    },
    cardContent: {
      flex: 1,
    },
    loadingContainer: {
      padding: 32,
      alignItems: "center",
      justifyContent: "center",
    },
    loadingText: {
      marginTop: 16,
      color: textSecondary,
    },
    emptyContainer: {
      padding: 32,
      alignItems: "center",
      justifyContent: "center",
    },
    emptyTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: textPrimary,
      marginBottom: 8,
    },
    emptyText: {
      color: textSecondary,
      textAlign: "center",
    },
    listContent: {
      paddingVertical: 8,
    },
    transactionItemContainer: {
      padding: 8,
    },
    separator: {
      height: 1,
      backgroundColor: borderColor,
    },
    modalContainer: {
      flex: 1,
      backgroundColor,
    },
  });
};
