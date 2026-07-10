import React from "react";
import { styled, Typography } from "@mui/material";
import { Link, useNavigate } from "@tanstack/react-router";
import { useEngravedHotkeys } from "../actions/useEngravedHotkeys";

export const GoToItemRow: React.FC<{
  children: React.ReactNode;
  icon: React.ReactNode;
  url: string;
  hasFocus: boolean;
  renderAtEnd?: () => React.ReactNode;
  onClick?: () => void;
}> = ({ children, icon, url, hasFocus, renderAtEnd, onClick }) => {
  const navigate = useNavigate();

  // `url` is a fully-built URL (path + query) computed at runtime, so we pass
  // it as `to` directly rather than as a compile-time route pattern.
  useEngravedHotkeys("enter", () => navigate({ to: url }), {
    enabled: hasFocus,
  });

  return (
    <Typography
      component="div"
      style={{ display: "flex", alignItems: "center", padding: "4px 8px" }}
    >
      <Link
        to={url}
        onClick={onClick}
        style={{ display: "flex", alignItems: "center", flexGrow: 1 }}
      >
        <IconContainer>{icon}</IconContainer>
        {children}
      </Link>
      {renderAtEnd ? <span>{renderAtEnd()}</span> : null}
    </Typography>
  );
};

const IconContainer = styled("div")`
  padding-right: 8px;
  padding-top: 4px;
`;
