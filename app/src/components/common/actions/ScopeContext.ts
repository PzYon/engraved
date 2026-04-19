import { createContext } from "react";

export interface IScopeContext {
  scope: string | undefined;
  setScope: (scope: string | undefined) => void;
}

export const ScopeContext = createContext<IScopeContext>({
  scope: undefined,
  setScope: undefined,
});
