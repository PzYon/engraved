import React, { CSSProperties } from "react";
import { IAction } from "./IAction";
import { Link, useNavigate } from "@tanstack/react-router";
import { useEngravedHotkeys } from "./useEngravedHotkeys";
import { useEngravedSearchParams } from "./searchParamHooks";

export const ActionLink: React.FC<{
  action: IAction;
  children?: React.ReactElement;
  style?: CSSProperties;
}> = ({ action, style, children }) => {
  const isAbsoluteUrl = action.href?.startsWith("http");

  const navigate = useNavigate();

  const { getNewSearchParams } = useEngravedSearchParams();

  const getSearch = () =>
    Object.fromEntries(getNewSearchParams(action.search ?? {}));

  // Actions with an own href navigate to that (already resolved) route. Actions
  // without a href only modify the search params of the current page, so we stay
  // on the current route ("."). Navigating to a full path here would remount the
  // page and wipe the freshly-set search params.
  const getHref = () => {
    const query = getNewSearchParams(action.search ?? {}).toString();
    return query ? `${action.href}?${query}` : action.href!;
  };

  useEngravedHotkeys(
    action.hotkey,
    () => {
      if (action.href) {
        navigate({ to: getHref() });
      } else {
        navigate({ to: ".", search: getSearch });
      }
    },
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
          getNewSearchParams(action.search ?? {}).toString(),
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

  if (action.href) {
    return (
      <Link to={getHref()} onClick={(e) => e.stopPropagation()} style={style}>
        {getChildren()}
      </Link>
    );
  }

  return (
    <Link
      to="."
      search={getSearch}
      onClick={(e) => e.stopPropagation()}
      style={style}
    >
      {getChildren()}
    </Link>
  );

  function getChildren(): React.ReactElement | React.ReactNode {
    return children ?? action.icon;
  }
};
