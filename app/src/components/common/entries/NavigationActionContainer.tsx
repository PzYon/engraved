import React, { useEffect } from "react";
import { styled } from "@mui/material";
import { paperBorderRadius } from "../../../theming/engravedTheme";

export const NavigationActionContainer: React.FC<{
  children: React.ReactNode;
  shrinkWidthIfPossible?: boolean;
  growWidthIfPossible?: boolean;
  giveFocus?: () => void;
  noBorder?: boolean;
}> = ({
  children,
  growWidthIfPossible,
  shrinkWidthIfPossible,
  giveFocus,
  noBorder,
}) => {
  useEffect(() => {
    giveFocus?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Host>
      <Inner
        style={{
          width: shrinkWidthIfPossible ? "auto" : "100%",
          maxWidth: growWidthIfPossible ? "100%" : "500px",
          border: noBorder ? 0 : undefined,
        }}
      >
        {children}
      </Inner>
    </Host>
  );
};

const Host = styled("div")`
  display: flex;
  justify-content: end;
`;

const Inner = styled("div")`
  background-color: ${(p) => p.theme.palette.common.white};
  border: 4px solid ${(p) => p.theme.palette.background.default};
  border-radius: ${paperBorderRadius};
  padding: ${(p) => p.theme.spacing(2)};
  margin-top: ${(p) => p.theme.spacing(2)};
`;
