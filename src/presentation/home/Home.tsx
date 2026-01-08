/**
 * Presentation Layer - Home Container
 *
 * Container que conecta o adapter ao view.
 */

import { useHomeAdapter } from "../../infrastructure/home/useHomeAdapter";
import { HomeView } from "./HomeView";
import type { HomeProps } from "../../domain/home/HomeState";

export function Home(props: HomeProps) {
  const { state, actions, getAnimatedStyle } = useHomeAdapter();

  return (
    <HomeView
      state={state}
      actions={actions}
      getAnimatedStyle={getAnimatedStyle}
    />
  );
}
