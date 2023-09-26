import React, { CSSProperties } from "react";
import { IAction } from "./IAction";
import { useActionHotkeys } from "./useActionHotkeys";
import { Link } from "react-router-dom";

export const ActionLink: React.FC<{
  action: IAction;
  children?: React.ReactElement;
  style?: CSSProperties;
}> = ({ action, style, children }) => {
  useActionHotkeys(action);

  return (
    <Link to={action.href} style={style}>
      {children ?? action.icon}
    </Link>
  );
};
