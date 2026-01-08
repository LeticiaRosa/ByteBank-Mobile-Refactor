/**
 * Presentation Layer - Confirm Delete Modal
 * Container que gerencia estado do modal de confirmação de exclusão
 */

import { useTheme } from "../../hooks/useTheme";
import { getTheme } from "../../styles/theme";
import { ConfirmDeleteModalView } from "./ConfirmDeleteModalView";

interface ConfirmDeleteModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting?: boolean;
  transactionId?: string;
}

export function ConfirmDeleteModal({
  visible,
  onConfirm,
  onCancel,
  isDeleting = false,
  transactionId = "",
}: ConfirmDeleteModalProps) {
  const { isDark } = useTheme();
  const theme = getTheme(isDark);

  return (
    <ConfirmDeleteModalView
      visible={visible}
      onConfirm={onConfirm}
      onCancel={onCancel}
      isDeleting={isDeleting}
      transactionId={transactionId}
      isDark={isDark}
      theme={theme}
    />
  );
}
