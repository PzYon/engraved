import { styled } from "@mui/material";
import { useDisplayModeContext } from "../../overview/overviewList/DisplayModeContext";
import React from "react";

export const TitleRow: React.FC<{
  children: React.ReactNode;
  hasFocus: boolean;
  hasNoContent: boolean;
  hasTitle: boolean;
}> = ({ children, hasFocus, hasNoContent, hasTitle }) => {
  const { isCompact } = useDisplayModeContext();

  return (isCompact && !hasFocus) || hasNoContent || !hasTitle ? (
    <>{children}</>
  ) : (
    <Row>{children}</Row>
  );
};

const Row = styled("div")`
  border-bottom: 1px solid ${(p) => p.theme.palette.background.default};
  padding-bottom: ${(p) => p.theme.spacing(1)};
  margin-bottom: ${(p) => p.theme.spacing(2)};
`;
