import { useEffect } from "react";
import { useHotkeysContext } from "react-hotkeys-hook";

export function useScopedFocus(scope: string) {
  const { enableScope, disableScope } = useHotkeysContext();

  useEffect(() => {
    console.log("Setting scope", scope);
    if (!scope) {
      return;
    }

    enableScope(scope);

    return () => {
      disableScope(scope);
    };
  }, [scope, enableScope, disableScope]);
}
