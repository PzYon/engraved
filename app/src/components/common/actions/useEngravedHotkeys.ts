import { DependencyList, useEffect, useMemo } from "react";
import {
  matchesKeyboardEvent,
  normalizeHotkeyFromParsed,
  type ParsedHotkey,
  parseHotkey,
  rawHotkeyToParsedHotkey,
  RegisterableHotkey,
  type UseHotkeyOptions,
} from "@tanstack/react-hotkeys";
import { isRichTextEditor } from "../isRichTextEditor";

type KeyboardModifiers = {
  alt?: boolean;
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
  mod?: boolean;
};

type Hotkey = KeyboardModifiers & {
  keys?: readonly string[];
  description?: string;
  hotkey: string;
};

type Options = Pick<
  UseHotkeyOptions,
  "enabled" | "platform" | "preventDefault" | "stopPropagation" | "target"
> & {
  enableOnContentEditable?: boolean;
  enableOnFormTags?: readonly string[];
  keydown?: boolean;
  keyup?: boolean;
};

type HotkeyInput = RegisterableHotkey | string;

const wildcardHotkey = "*";

const keyAliases: Record<string, string> = {
  backspace: "Backspace",
  comma: ",",
  del: "Delete",
  delete: "Delete",
  down: "ArrowDown",
  enter: "Enter",
  esc: "Escape",
  escape: "Escape",
  left: "ArrowLeft",
  period: ".",
  return: "Enter",
  right: "ArrowRight",
  slash: "/",
  space: "Space",
  up: "ArrowUp",
};

const defaultOptions: Pick<Options, "enableOnContentEditable" | "enabled"> = {
  enableOnContentEditable: true,
  enabled: true,
};

export function useEngravedHotkeys(
  hotkey: HotkeyInput | HotkeyInput[],
  callback: (keyboardEvent: KeyboardEvent, hotkeysEvent: Hotkey) => void,
  options?: Options | DependencyList,
  dependencies?: Options | DependencyList,
) {
  const explicitOptions = isHotkeyOptions(options)
    ? options
    : isHotkeyOptions(dependencies)
      ? dependencies
      : undefined;

  const resolvedOptions: Options = { ...defaultOptions, ...explicitOptions };

  /*
  const resolvedDependencies = Array.isArray(options)
    ? options
    : Array.isArray(dependencies)
      ? dependencies
      : undefined;

  const stableCallback = useCallback(callback, resolvedDependencies ?? [callback]);
*/

  const hotkeys = useMemo(
    () => (Array.isArray(hotkey) ? hotkey : hotkey ? [hotkey] : []),
    [hotkey],
  );

  const parsedHotkeys = useMemo(
    () =>
      hotkeys.map((currentHotkey) =>
        normalizeHotkey(currentHotkey, resolvedOptions?.platform),
      ),
    [hotkeys, resolvedOptions?.platform],
  );

  useEffect(() => {
    if (!parsedHotkeys.length || resolvedOptions?.enabled === false) {
      return;
    }

    const target = resolveTarget(resolvedOptions?.target);

    if (!target) {
      return;
    }

    const eventTypes = getEventTypes(resolvedOptions);

    if (!eventTypes.length) {
      return;
    }

    const listener = (keyboardEvent: KeyboardEvent) => {
      if (shouldIgnoreEvent(keyboardEvent, resolvedOptions)) {
        return;
      }

      const matchedHotkey = parsedHotkeys.find((parsedHotkey) => {
        return parsedHotkey === wildcardHotkey
          ? true
          : matchesKeyboardEvent(
              keyboardEvent,
              parsedHotkey,
              resolvedOptions?.platform,
            );
      });

      if (!matchedHotkey) {
        return;
      }

      if (explicitOptions?.preventDefault === undefined) {
        keyboardEvent.preventDefault();
      } else if (resolvedOptions?.preventDefault) {
        keyboardEvent.preventDefault();
      }

      const hotkeyEvent =
        matchedHotkey === wildcardHotkey
          ? { hotkey: wildcardHotkey }
          : getCompatibilityHotkey(matchedHotkey, resolvedOptions?.platform);

      //      stableCallback(keyboardEvent, hotkeyEvent);
      callback(keyboardEvent, hotkeyEvent);

      if (resolvedOptions?.stopPropagation) {
        keyboardEvent.stopPropagation();
      }

      if (isRichTextEditor(keyboardEvent.target as HTMLElement)) {
        keyboardEvent.stopPropagation();
      }
    };

    for (const eventType of eventTypes) {
      target.addEventListener(eventType, listener as EventListener);
    }

    return () => {
      for (const eventType of eventTypes) {
        target.removeEventListener(eventType, listener as EventListener);
      }
    };
  }, [explicitOptions, parsedHotkeys, resolvedOptions /*, stableCallback*/]);
}

function isHotkeyOptions(value?: Options | DependencyList): value is Options {
  return value !== undefined && !Array.isArray(value);
}

function getCompatibilityHotkey(
  parsedHotkey: ParsedHotkey,
  platform?: UseHotkeyOptions["platform"],
): Hotkey {
  return {
    alt: parsedHotkey.alt,
    ctrl: parsedHotkey.ctrl,
    keys: [String(parsedHotkey.key).toLowerCase()],
    meta: parsedHotkey.meta,
    shift: parsedHotkey.shift,
    hotkey: normalizeHotkeyFromParsed(parsedHotkey, platform),
  };
}

function getEventTypes(options?: Options): Array<keyof DocumentEventMap> {
  if (options?.keydown === false && options.keyup !== true) {
    return [];
  }

  if (options?.keyup) {
    return options.keydown === false ? ["keyup"] : ["keydown", "keyup"];
  }

  return ["keydown"];
}

function normalizeHotkey(
  hotkey: HotkeyInput,
  platform?: UseHotkeyOptions["platform"],
): ParsedHotkey | typeof wildcardHotkey {
  if (typeof hotkey !== "string") {
    return rawHotkeyToParsedHotkey(hotkey, platform);
  }

  if (hotkey === wildcardHotkey) {
    return wildcardHotkey;
  }

  return parseHotkey(
    hotkey
      .split("+")
      .map((token) => normalizeHotkeyToken(token))
      .join("+"),
    platform,
  );
}

function normalizeHotkeyToken(token: string): string {
  const trimmedToken = token.trim();
  const normalizedToken = keyAliases[trimmedToken.toLowerCase()];

  return normalizedToken ?? trimmedToken;
}

function shouldIgnoreEvent(
  keyboardEvent: KeyboardEvent,
  options?: Options,
): boolean {
  const targetElement = getTargetElement(keyboardEvent.target);

  if (!targetElement) {
    return false;
  }

  if (targetElement.isContentEditable) {
    return !options?.enableOnContentEditable;
  }

  const allowedFormTags = options?.enableOnFormTags?.map((tag) =>
    tag.toLowerCase(),
  );

  if (!allowedFormTags?.length) {
    return isFormTag(targetElement);
  }

  return (
    isFormTag(targetElement) &&
    !allowedFormTags.includes(targetElement.tagName.toLowerCase())
  );
}

function getTargetElement(eventTarget: EventTarget | null): HTMLElement | null {
  return eventTarget instanceof HTMLElement ? eventTarget : null;
}

function isFormTag(targetElement: HTMLElement): boolean {
  return ["input", "select", "textarea"].includes(
    targetElement.tagName.toLowerCase(),
  );
}

function resolveTarget(
  target?: UseHotkeyOptions["target"],
): Document | HTMLElement | Window | null {
  if (!target) {
    return document;
  }

  if ("current" in target) {
    return target.current;
  }

  return target;
}
