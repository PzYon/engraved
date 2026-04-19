import { useContext } from "react";
import { IScopeContext, ScopeContext } from "./ScopeContext";

export function useScopeContext(): IScopeContext {
  return useContext(ScopeContext);
}
