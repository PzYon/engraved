import React from "react";
import { ActionIconButton } from "./components/common/actions/ActionIconButton";
import { FadeInContainer } from "./components/common/FadeInContainer";
import { ActionFactory } from "./components/common/actions/ActionFactory";
import { useIsOffline } from "./components/common/useIsOffline";

export const OfflineIndicator: React.FC = () => {
  const isOffline = useIsOffline();
  if (!isOffline) {
    return null;
  }

  return (
    <FadeInContainer doPulsate={false}>
      <ActionIconButton action={ActionFactory.offlineIndicator()} />
    </FadeInContainer>
  );
};
