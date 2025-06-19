import React, { memo, useLayoutEffect, useRef } from "react";
import { IEntity } from "../../../serverApi/IEntity";
import { paperBorderRadius } from "../../../theming/engravedTheme";
import { styled } from "@mui/material";
import { PageSection } from "../../layout/pages/PageSection";
import { useDisplayModeContext } from "./DisplayModeContext";
import { useOverviewListContext } from "./OverviewListContext";

export const OverviewListItem: React.FC<{
  children: React.ReactNode;
  item: IEntity;
  tabIndex: number;
  hasFocus: boolean;
}> = memo(({ children, item, tabIndex, hasFocus }) => {
  const domElementRef = useRef<HTMLDivElement>(undefined);

  const { isCompact } = useDisplayModeContext();

  const { setActiveItemId } = useOverviewListContext();

  useLayoutEffect(() => {
    if (hasFocus) {
      domElementRef.current?.focus();
    }

    const timer = setTimeout(() => {
      if (!hasFocus) {
        return;
      }

      domElementRef.current?.scrollIntoView({
        block: "nearest",
        inline: "nearest",
        behavior: "smooth",
      });
    }, 0);

    return () => clearTimeout(timer);
  }, [hasFocus]);

  return (
    <Host
      ref={domElementRef}
      tabIndex={tabIndex}
      id={item.id}
      data-testid={item.id}
      onClick={() => {
        setActiveItemId(item.id);
        domElementRef.current?.focus();
      }}
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
