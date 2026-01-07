/**
 * Presentation Layer - Profile Container
 * Container com lógica de apresentação
 * Responsável por gerenciar o estado e passar para o componente visual
 * Segue o Container/Presenter Pattern
 */

import { useProfileAdapter } from "../../infrastructure/profile/useProfileAdapter";
import { ProfileView } from "./ProfileView";

export function Profile() {
  // Obtém o estado e ações através do adapter
  const profileData = useProfileAdapter();

  // Passa todos os dados para o componente de apresentação puro
  return <ProfileView {...profileData} />;
}
