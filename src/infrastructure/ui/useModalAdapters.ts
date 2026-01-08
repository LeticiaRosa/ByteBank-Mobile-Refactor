/**
 * Infrastructure Layer - Modal Adapters
 *
 * Adapta hooks e estado para modais
 */

import { useState } from "react";
import {
  MODAL_RULES,
  MODAL_DEFAULTS,
  ModalState,
} from "../../domain/ui/ModalState";

// ============= CONFIRM DELETE MODAL ADAPTER =============

export function useConfirmDeleteModalAdapter() {
  const [state, setState] = useState<ModalState>({
    visible: false,
    isLoading: false,
  });

  const open = () => {
    setState({ visible: true, isLoading: false });
  };

  const close = () => {
    if (MODAL_RULES.canDismiss(state, MODAL_DEFAULTS.CONFIG)) {
      setState({ visible: false, isLoading: false });
    }
  };

  const startLoading = () => {
    setState((prev) => ({ ...prev, isLoading: true }));
  };

  const stopLoading = () => {
    setState((prev) => ({ ...prev, isLoading: false }));
  };

  const handleConfirm = async (onConfirm: () => Promise<void>) => {
    if (!MODAL_RULES.canConfirm(state)) return;

    startLoading();
    try {
      await onConfirm();
      close();
    } catch (error) {
      stopLoading();
      throw error;
    }
  };

  return {
    visible: state.visible,
    isLoading: state.isLoading,
    open,
    close,
    handleConfirm,
    canDismiss: MODAL_RULES.canDismiss(state, MODAL_DEFAULTS.CONFIG),
  };
}

// ============= GENERIC MODAL ADAPTER =============

export function useModalAdapter() {
  const [visible, setVisible] = useState(false);

  const open = () => setVisible(true);
  const close = () => setVisible(false);
  const toggle = () => setVisible((prev) => !prev);

  return {
    visible,
    open,
    close,
    toggle,
  };
}
