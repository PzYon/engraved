import React, { CSSProperties } from "react";
import { IAction } from "./IAction";
import { Link, useLocation } from "react-router-dom";

export const ActionLink: React.FC<{
  action: IAction;
  children?: React.ReactElement;
  style?: CSSProperties;
}> = ({ action, style, children }) => {
  const loc = useLocation();

  if (action.isDisabled) {
    return <span style={style}>{children ?? action.icon}</span>;
  }

  return (
    <Link
      to={{
        pathname: action.href,
        search: getSearch(),
      }}
      style={style}
      title={action.label}
    >
      {children ?? action.icon}
    </Link>
  );

  function getSearch(): string {
    const params: string[] = [];

    if (loc.search) {
      params.push(...loc.search.replace("?", "").split("&"));
    }

    if (action.search) {
      params.push(...action.search.replace("?", "").split("&"));
    }

    return params.length ? `?${params.join("&")}` : undefined;
  }
};
