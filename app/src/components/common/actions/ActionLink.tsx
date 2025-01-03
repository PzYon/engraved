import React, { CSSProperties } from "react";
import { IAction } from "./IAction";
import { Link } from "react-router-dom";
import { useEngravedSearchParams } from "./searchParamHooks";
import { useActionHotkey } from "./UseActionHotkey";

export const ActionLink: React.FC<{
  action: IAction;
  children?: React.ReactElement;
  style?: CSSProperties;
}> = ({ action, style, children }) => {
  const { getAppendedSearchParams } = useEngravedSearchParams();

  const isAbsoluteUrl = action.href?.startsWith("http");

  useActionHotkey(action);

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
