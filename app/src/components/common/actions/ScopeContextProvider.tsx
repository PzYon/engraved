import React, { useState } from "react";
import { ScopeContext } from "./ScopeContext";
import { useScopedFocus } from "./useScopedFocus";

export const ScopeContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [scope, setScope] = useState<string | undefined>(undefined);

  useScopedFocus(scope);

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
