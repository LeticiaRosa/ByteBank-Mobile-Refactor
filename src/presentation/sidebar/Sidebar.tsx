/**
 * Presentation Layer - Sidebar Container
 * Container component que gerencia a lógica e conecta com a camada de infraestrutura
 * Segue o padrão Container/Presenter
 */

import { useSidebarAdapter } from "../../infrastructure/sidebar/useSidebarAdapter";
import { SidebarView } from "./SidebarView";

export function Sidebar() {
  const { theme, actions } = useSidebarAdapter();

  return (
    <SidebarView
      theme={theme}
      onNavigateToProfile={actions.navigateToProfile}
    />
  );
}
