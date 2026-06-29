import { styled } from "@mui/material";
import { useDisplayModeContext } from "../../overview/overviewList/DisplayModeContext";
import React from "react";

export const TitleRow: React.FC<{
  children: React.ReactNode;
  hasFocus: boolean;
}> = ({ children, hasFocus }) => {
  const { isCompact } = useDisplayModeContext();

  return isCompact && !hasFocus ? (
    <>{children}</>
  ) : (
    <FullRow>{children}</FullRow>
  );
};

const FullRow = styled("div")`
  border-bottom: 1px solid ${(p) => p.theme.palette.background.default};
  padding-bottom: 6px;
  margin-bottom: 4px;
`;
