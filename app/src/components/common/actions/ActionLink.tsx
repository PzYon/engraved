import React, { CSSProperties } from "react";
import { IAction } from "./IAction";
import { Link, useNavigate } from "react-router-dom";
import { useHotkeys } from "react-hotkeys-hook";

export const ActionLink: React.FC<{
  action: IAction;
  children?: React.ReactElement;
  style?: CSSProperties;
}> = ({ action, style, children }) => {
  const navigate = useNavigate();

  useHotkeys(
    action.hotkey,
    (keyboardEvent) => {
      keyboardEvent.preventDefault();
      navigate({
        pathname: action.href,
        search: action.search,
      });
    },
    { enabled: !!action.hotkey },
  );

  if (action.isDisabled) {
    return <span style={style}>{children ?? action.icon}</span>;
  }

  return (
    <Link
      to={{ pathname: action.href, search: action.search }}
      style={style}
      title={action.label}
    >
      {children ?? action.icon}
    </Link>
  );
};
