import React from "react";
import { styled, Typography } from "@mui/material";
import { Link, useNavigate } from "@tanstack/react-router";
import { useEngravedHotkeys } from "../../common/actions/useEngravedHotkeys";

// These components navigate to dynamically computed full URLs (with params
// embedded). TanStack Router's `to` type is a union of route patterns, so we
// use a typed shim instead of `any` to bridge the gap.
type DynamicNavigate = (opts: { to: string }) => void;
const DynamicLink = Link as React.FC<{
  to: string;
  onClick?: () => void;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}>;

export const GoToItemRow: React.FC<{
  children: React.ReactNode;
  icon: React.ReactNode;
  url: string;
  hasFocus: boolean;
  renderAtEnd?: () => React.ReactNode;
  onClick?: () => void;
}> = ({ children, icon, url, hasFocus, renderAtEnd, onClick }) => {
  const navigate = useNavigate();

  useEngravedHotkeys(
    "enter",
    () => void (navigate as unknown as DynamicNavigate)({ to: url }),
    {
      enabled: hasFocus,
    },
  );

  return (
    <Typography
      component="div"
      style={{ display: "flex", alignItems: "center", padding: "4px 8px" }}
    >
      <DynamicLink
        to={url}
        onClick={onClick}
        style={{ display: "flex", alignItems: "center", flexGrow: 1 }}
      >
        <IconContainer>{icon}</IconContainer>
        {children}
      </DynamicLink>
      {renderAtEnd ? <span>{renderAtEnd()}</span> : null}
    </Typography>
  );
};

const IconContainer = styled("div")`
  padding-right: 8px;
  padding-top: 4px;
`;
