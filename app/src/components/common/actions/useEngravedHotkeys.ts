import { DependencyList } from "react";
import { HotkeyCallback, Options, useHotkeys } from "react-hotkeys-hook";
import { isRichTextEditor } from "../isRichTextEditor";
import { useScopeContext } from "./useScopeContext";

type Scopes = string | readonly string[];

type KeyboardModifiers = {
  alt?: boolean;
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
  mod?: boolean;
  useKey?: boolean;
};

type Hotkey = KeyboardModifiers & {
  keys?: readonly string[];
  scopes?: Scopes;
  description?: string;
  isSequence?: boolean;
  hotkey: string;
};

export function useEngravedHotkeys(
  hotkey: string | string[],
  callback: HotkeyCallback,
  options?: Options | DependencyList,
  dependencies?: Options | DependencyList,
) {
  const contextScope = useScopeContext().scope;
  const isOptionsObject = options && !Array.isArray(options);
  const finalOptions: Options = isOptionsObject ? (options as Options) : {};
  const finalDependencies = Array.isArray(options) ? options : dependencies;

  const optionScopes = finalOptions.scopes
    ? Array.isArray(finalOptions.scopes)
      ? (finalOptions.scopes as string[])
      : [finalOptions.scopes as string]
    : [];

  const effectiveScopes: string[] | undefined =
    contextScope || optionScopes.length > 0
      ? [...(contextScope ? [contextScope] : []), ...optionScopes]
      : undefined;

  console.log("effective scope: ", effectiveScopes);

  useHotkeys(
    hotkey,
    (keyboardEvent: KeyboardEvent, hotkeysEvent: Hotkey) => {
      if (options && finalOptions.preventDefault === undefined) {
        keyboardEvent.preventDefault();
      }

      callback(keyboardEvent, hotkeysEvent);

      if (isRichTextEditor(keyboardEvent.target as HTMLElement)) {
        keyboardEvent.stopPropagation();
      }
    },
    { enableOnContentEditable: true, ...finalOptions, scopes: effectiveScopes },
    finalDependencies,
  );
}
