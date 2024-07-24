import React, { CSSProperties } from "react";
import { IAction } from "./IAction";
import { createSearchParams, Link, useNavigate } from "react-router-dom";
import { useEngravedSearchParams } from "./itemActionHook";
import { useHotkeys } from "react-hotkeys-hook";

export const ActionLink: React.FC<{
  action: IAction;
  children?: React.ReactElement;
  style?: CSSProperties;
}> = ({ action, style, children }) => {
  const { getAppendedSearchParams } = useEngravedSearchParams();

  const navigate = useNavigate();

  useHotkeys(
    action.hotkey,
    (keyboardEvent) => {
      keyboardEvent.preventDefault();
      navigate({
        pathname: action.href,
        search: createSearchParams(action.search).toString(),
      });
    },
    {
      enabled:
        !!action.hotkey &&
        !!(action.href || Object.keys(action.search ?? {}).length),
      enableOnFormTags: ["textarea", "input"],
    },
  );

  if (action.isDisabled) {
    return <span style={style}>{children ?? action.icon}</span>;
  }

  return (
    <Link
      to={{
        pathname: action.href,
        search: getAppendedSearchParams(action.search),
      }}
      style={style}
      title={action.label}
    >
      {children ?? action.icon}
    </Link>
  );
};
