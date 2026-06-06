import React, { CSSProperties } from "react";
import { IAction } from "./IAction";
import { Link, useNavigate } from "@tanstack/react-router";
import { useEngravedHotkeys } from "./useEngravedHotkeys";
import { knownQueryParams, useEngravedSearchParams } from "./searchParamHooks";

export const ActionLink: React.FC<{
  action: IAction;
  children?: React.ReactElement;
  style?: CSSProperties;
}> = ({ action, style, children }) => {
  const isAbsoluteUrl = action.href?.startsWith("http");

  const navigate = useNavigate();

  const { getNewSearchParams } = useEngravedSearchParams();

  // The search params an internal link/navigation should end up with: the
  // current params merged with the action's (empty/false values are dropped by
  // getNewSearchParams). Passed to the router as a structured object rather than
  // a hand-built query string, so `to` stays a clean route path.
  const getSearch = () => getNewSearchParams(action.search ?? {});

  // Actions with an own href navigate to that route; actions without one only
  // tweak the search params, so they stay on the current route ("."). In both
  // cases we keep `to` and `search` separate: folding the query into `to` would
  // make the router treat it as an opaque path and remount the page, wiping the
  // freshly-set search params.
  const to = action.href ?? ".";

  // Don't let the router scroll to the top for actions that only open a panel on
  // the current view: either there's no href (we stay on "."), or the action
  // sets an action-key (a panel on the same page, even when it carries the
  // current page's href). Real page navigations (go to journal, home, ...) keep
  // the default resetScroll so they land at the top. `undefined` = router
  // default (true).
  const resetScroll =
    !action.href || action.search?.[knownQueryParams.actionKey]
      ? false
      : undefined;

  useEngravedHotkeys(
    action.hotkey,
    () => navigate({ to, search: getSearch, resetScroll }),
    {
      enabled:
        !isAbsoluteUrl &&
        !!action.hotkey &&
        !!(action.href || Object.keys(action.search ?? {}).length),
      enableOnFormTags: ["textarea", "input"],
    },
  );

  if (action.isDisabled) {
    return <span style={style}>{getChildren()}</span>;
  }

  if (isAbsoluteUrl) {
    return (
      <a
        href={new URL(
          // getSearch() never yields undefined values (mergeSearch drops them).
          new URLSearchParams(getSearch() as Record<string, string>).toString(),
          action.href,
        ).toString()}
        style={style}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
      >
        {getChildren()}
      </a>
    );
  }

  // Stop click and mouseup from bubbling: click prevents the list-row handler
  // from firing, mouseup prevents an already-open action panel's
  // ClickAwayListener (which listens on the document's mouseup) from closing.
  // Without the latter, switching from one action to another would briefly
  // navigate via root ("/") before applying the new action's params.
  const stopEvents = (e: React.SyntheticEvent) => e.stopPropagation();

  return (
    <Link
      to={to}
      search={getSearch}
      resetScroll={resetScroll}
      onClick={stopEvents}
      onMouseUp={stopEvents}
      style={style}
    >
      {getChildren()}
    </Link>
  );

  function getChildren(): React.ReactElement | React.ReactNode {
    return children ?? action.icon;
  }
};
