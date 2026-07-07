import React, { useEffect, useState } from "react";
import { ActionIconButton } from "./components/common/actions/ActionIconButton";
import { FadeInContainer } from "./components/common/FadeInContainer";
import { ActionFactory } from "./components/common/actions/ActionFactory";

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

function useIsOffline(): boolean {
  const [isOffline, setIsOffline] = useState(
    typeof navigator !== "undefined" ? !navigator.onLine : false,
  );

  useEffect(() => {
    const update = () => setIsOffline(!navigator.onLine);

    window.addEventListener("online", update);
    window.addEventListener("offline", update);

    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  return isOffline;
}
