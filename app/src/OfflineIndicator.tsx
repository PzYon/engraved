import React from "react";
import AirplanemodeActiveIcon from "@mui/icons-material/AirplanemodeActive";
import { ActionIconButton } from "./components/common/actions/ActionIconButton";
import { IAction } from "./components/common/actions/IAction";
import { FadeInContainer } from "./components/common/FadeInContainer";

// Phase 0 (local-first): when the browser is offline the app serves the last
// data persisted to IndexedDB (see ReactQueryProviderWrapper). This surfaces
// that read-only state next to the "new version available" indicator so it's
// obvious the user is looking at saved data rather than live data.
export const OfflineIndicator: React.FC = () => {
  const isOffline = useIsOffline();

  if (!isOffline) {
    return null;
  }

  return (
    <FadeInContainer doPulsate={false}>
      <ActionIconButton action={getOfflineAction()} />
    </FadeInContainer>
  );
};

function getOfflineAction(): IAction {
  return {
    icon: <AirplanemodeActiveIcon fontSize="small" />,
    label: "You are offline - showing saved data.",
    key: "offline-indicator",
    sx: {
      mr: 2,
    },
  };
}

function useIsOffline(): boolean {
  const [isOffline, setIsOffline] = React.useState(
    typeof navigator !== "undefined" ? !navigator.onLine : false,
  );

  React.useEffect(() => {
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
