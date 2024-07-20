import React, { CSSProperties } from "react";
import { IAction } from "./IAction";
import { Link } from "react-router-dom";
import { useCustomSearchParams } from "./itemActionHook";

export const ActionLink: React.FC<{
  action: IAction;
  children?: React.ReactElement;
  style?: CSSProperties;
}> = ({ action, style, children }) => {
  const { appendToSearchAsUrl } = useCustomSearchParams();

  if (action.isDisabled) {
    return <span style={style}>{children ?? action.icon}</span>;
  }

  return (
    <Link
      to={{
        pathname: action.href,
        search: appendToSearchAsUrl(action.search),
      }}
      style={style}
      title={action.label}
    >
      {children ?? action.icon}
    </Link>
  );
};
