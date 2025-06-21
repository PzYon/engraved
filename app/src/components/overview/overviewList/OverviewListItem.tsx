import React, { memo, useEffect, useLayoutEffect, useRef } from "react";
import { IEntity } from "../../../serverApi/IEntity";
import { paperBorderRadius } from "../../../theming/engravedTheme";
import { styled } from "@mui/material";
import { PageSection } from "../../layout/pages/PageSection";
import { useDisplayModeContext } from "./DisplayModeContext";

export const OverviewListItem: React.FC<{
  children: React.ReactNode;
  item: IEntity;
  hasFocus: boolean;
  onClick: () => void;
}> = memo(({ children, item, hasFocus, onClick }) => {
  const domElementRef = useRef<HTMLDivElement>(undefined);

  const { isCompact } = useDisplayModeContext();

  useLayoutEffect(() => {
    if (hasFocus) {
      domElementRef.current?.focus();
    }
  }, [hasFocus]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasFocus) {
        return;
      }

      domElementRef.current?.scrollIntoView({
        block: "nearest",
        inline: "nearest",
        behavior: "smooth",
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [hasFocus]);

  return (
    <Host
      ref={domElementRef}
      tabIndex={0}
      id={item.id}
      data-testid={item.id}
      onClick={() => onClick?.()}
    >
      <PageSection
        style={
          isCompact
            ? {
                marginTop: "8px",
                marginBottom: "8px",
              }
            : {}
        }
      >
        {children}
      </PageSection>
    </Host>
  );
});

const Host = styled("div")`
  &:focus {
    outline: 2px solid ${(p) => p.theme.palette.primary.main};
  }

  border-radius: ${paperBorderRadius};
`;
