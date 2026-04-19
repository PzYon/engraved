import React, { useEffect, useState } from "react";
import { ScopeContext } from "./ScopeContext";
import { useHotkeysContext } from "react-hotkeys-hook";

export const ScopeContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [scope, setScope] = useState<string | undefined>(undefined);

  const { enableScope, disableScope } = useHotkeysContext();

  useEffect(() => {
    console.log("Context: Scope set to " + scope);

    enableScope(scope);

    return () => {
      console.log("Context: Cleared scope " + scope);
      disableScope(scope);
    };
  }, [scope, enableScope, disableScope]);

  return (
    <ScopeContext.Provider
      value={{
        scope,
        setScope,
      }}
    >
      {children}
    </ScopeContext.Provider>
  );
};
