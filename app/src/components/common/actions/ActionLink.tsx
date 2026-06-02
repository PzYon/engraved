import React, { CSSProperties } from "react";
import { IAction } from "./IAction";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useEngravedHotkeys } from "./useEngravedHotkeys";
import { useEngravedSearchParams } from "./searchParamHooks";

export const ActionLink: React.FC<{
  action: IAction;
  children?: React.ReactElement;
  style?: CSSProperties;
}> = ({ action, style, children }) => {
  const isAbsoluteUrl = action.href?.startsWith("http");

  const navigate = useNavigate();
  const pathname = useLocation({ select: (l) => l.pathname });

  const { getNewSearchParams } = useEngravedSearchParams();

  // Build a fully-resolved URL (target path + merged query). Actions without an
  // own href just update the search params of the current page. `action.href`
  // is resolved at runtime, so we pass the complete URL string as `to` rather
  // than a compile-time route pattern.
  const getHref = () => {
    const query = getNewSearchParams(action.search ?? {}).toString();
    const path = action.href ?? pathname;
    return query ? `${path}?${query}` : path;
  };

  useEngravedHotkeys(
    action.hotkey,
    () => {
      void navigate({ to: getHref() });
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

  return (
    <Link to={getHref()} onClick={(e) => e.stopPropagation()} style={style}>
      {getChildren()}
    </Link>
  );

  function getChildren(): React.ReactElement | React.ReactNode {
    return children ?? action.icon;
  }
};
