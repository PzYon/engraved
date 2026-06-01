import React, { CSSProperties } from "react";
import { IAction } from "./IAction";
import { Link, useNavigate } from "@tanstack/react-router";
import { useEngravedHotkeys } from "./useEngravedHotkeys";
import { useEngravedSearchParams } from "./searchParamHooks";

// IAction.href holds pre-computed URLs (params already embedded) and external
// HTTPS URLs. TanStack Router's `to` type is a union of route patterns, so we
// use typed shims instead of `any` to bridge the gap.
type DynamicNavigate = (opts: {
  to?: string;
  search?: () => Record<string, string>;
}) => void;
const DynamicLink = Link as React.FC<{
  to?: string;
  search?: () => Record<string, string>;
  onClick?: React.MouseEventHandler;
  style?: CSSProperties;
  children?: React.ReactNode;
}>;

export const ActionLink: React.FC<{
  action: IAction;
  children?: React.ReactElement;
  style?: CSSProperties;
}> = ({ action, style, children }) => {
  const isAbsoluteUrl = action.href?.startsWith("http");

  const navigate = useNavigate();

  const { getNewSearchParams } = useEngravedSearchParams();

  useEngravedHotkeys(
    action.hotkey,
    () => {
      void (navigate as unknown as DynamicNavigate)({
        to: action.href,
        search: () =>
          Object.fromEntries(getNewSearchParams(action.search ?? {})),
      });
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
    <DynamicLink
      to={action.href}
      search={() => Object.fromEntries(getNewSearchParams(action.search ?? {}))}
      onClick={(e) => e.stopPropagation()}
      style={style}
    >
      {getChildren()}
    </DynamicLink>
  );

  function getChildren(): React.ReactElement | React.ReactNode {
    return children ?? action.icon;
  }
};
