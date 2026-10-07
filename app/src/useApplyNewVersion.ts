import { useState } from "react";
import { applyNewVersion } from "./serviceWorkerUpdater";

// Applying a new version ends in a reload, but only after the new service
// worker has been installed, which can take many seconds. isApplying never
// goes back to false: the reload replaces the page.
export const useApplyNewVersion = () => {
  const [isApplying, setIsApplying] = useState(false);

  const apply = () => {
    if (isApplying) {
      return;
    }

    setIsApplying(true);
    void applyNewVersion();
  };

  return { isApplying, apply };
};
