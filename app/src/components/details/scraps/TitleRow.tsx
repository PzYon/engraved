import { styled } from "@mui/material";
import { useDisplayModeContext } from "../../overview/overviewList/DisplayModeContext";
import React from "react";

export const TitleRow: React.FC<{
  children: React.ReactNode;
  hasFocus: boolean;
  hasNoContent: boolean;
}> = ({ children, hasFocus, hasNoContent }) => {
  const { isCompact } = useDisplayModeContext();

  return (isCompact && !hasFocus) || hasNoContent ? (
    <>{children}</>
  ) : (
    <Row>{children}</Row>
  );
};

const Row = styled("div")`
  border-bottom: 1px solid ${(p) => p.theme.palette.background.default};
  margin-bottom: ${(p) => p.theme.spacing(1)};
  margin-bottom: ${(p) => p.theme.spacing(2)};
`;
