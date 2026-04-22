import React, { CSSProperties } from "react";
import { IAction } from "./IAction";
import { Link, useNavigate } from "react-router-dom";
import { useEngravedSearchParams } from "./searchParamHooks";
import { useEngravedHotkeysNew } from "./useEngravedHotkeysNew";

export const ActionLink: React.FC<{
  action: IAction;
  children?: React.ReactElement;
  style?: CSSProperties;
}> = ({ action, style, children }) => {
  const isAbsoluteUrl = action.href?.startsWith("http");

  const navigate = useNavigate();

  const { getNewSearchParams } = useEngravedSearchParams();

  useEngravedHotkeysNew(
    action.hotkey,
    () => {
      navigate({
        pathname: action.href,
        search: getNewSearchParams(action.search).toString(),
      });
    },
    {
      enabled:
        !isAbsoluteUrl &&
        !!action.hotkey &&
        !!(action.href || Object.keys(action.search ?? {}).length),
      ignoreInputs: false,
    },
  );

  if (action.isDisabled) {
    return <span style={style}>{getChildren()}</span>;
  }

  if (isAbsoluteUrl) {
    return (
      <a
        href={new URL(
          getNewSearchParams(action.search).toString(),
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
    <Link
      to={{
        pathname: action.href,
        search: getNewSearchParams(action.search).toString(),
      }}
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
