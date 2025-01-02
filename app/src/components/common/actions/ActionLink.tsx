import React, { CSSProperties } from "react";
import { IAction } from "./IAction";
import { createSearchParams, Link, useNavigate } from "react-router-dom";
import { useEngravedSearchParams } from "./searchParamHooks";
import { useHotkeys } from "react-hotkeys-hook";

export const ActionLink: React.FC<{
  action: IAction;
  children?: React.ReactElement;
  style?: CSSProperties;
}> = ({ action, style, children }) => {
  const { getAppendedSearchParams } = useEngravedSearchParams();

  const navigate = useNavigate();

  const isAbsoluteUrl = action.href?.startsWith("http");

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
          new URLSearchParams(action.search).toString(),
          action.href,
        ).toString()}
        style={style}
        target="_blank"
        rel="noopener noreferrer"
      >
        {getChildren()}
      </a>
    );
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
      {getChildren()}
    </Link>
  );

  function getChildren() {
    return children ?? action.icon;
  }
};
