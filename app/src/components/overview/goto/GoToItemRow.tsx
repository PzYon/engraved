import React from "react";
import { styled, Typography } from "@mui/material";
import { Link, useNavigate } from "@tanstack/react-router";
import { useEngravedHotkeys } from "../../common/actions/useEngravedHotkeys";

export const GoToItemRow: React.FC<{
  children: React.ReactNode;
  icon: React.ReactNode;
  url: string;
  hasFocus: boolean;
  renderAtEnd?: () => React.ReactNode;
  onClick?: () => void;
}> = ({ children, icon, url, hasFocus, renderAtEnd, onClick }) => {
  const navigate = useNavigate();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useEngravedHotkeys("enter", () => void navigate({ to: url as any }), {
    enabled: hasFocus,
  });

  return (
    <Typography
      component="div"
      style={{ display: "flex", alignItems: "center", padding: "4px 8px" }}
    >
      <Link
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        to={url as any}
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
