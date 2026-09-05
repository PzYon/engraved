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
  const { to, search } = getLinkTarget(url);

  useEngravedHotkeys("enter", () => navigate({ to, search }), {
    enabled: hasFocus,
  });

  return (
    <Typography
      component="div"
      style={{ display: "flex", alignItems: "center", padding: "4px 8px" }}
    >
      <Link
        to={to}
        search={search}
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

function getLinkTarget(url: string): {
  to: string;
  search?: Record<string, string>;
} {
  const parsed = new URL(url, "https://engraved.local");
  const search = Object.fromEntries(parsed.searchParams.entries());

  return {
    to: parsed.pathname,
    search: Object.keys(search).length ? search : undefined,
  };
}
