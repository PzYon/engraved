import React, { useEffect, useRef } from "react";
import { IEntity } from "../../../serverApi/IEntity";
import { paperBorderRadius } from "../../../theming/engravedTheme";
import { styled } from "@mui/material";
import { PageSection } from "../../layout/pages/PageSection";
import { useDisplayModeContext } from "./DisplayModeContext";
import { useEngravedHotkeys } from "../../common/actions/useEngravedHotkeys";
import { useListItemsContext } from "./OverviewList";

export const OverviewListItem: React.FC<{
  children: React.ReactNode;
  item: IEntity;
  tabIndex: number;
  hasFocus: boolean;
}> = ({ children, item, tabIndex, hasFocus }) => {
  const domElementRef = useRef<HTMLDivElement>(undefined);

  const { isCompact } = useDisplayModeContext();

  const { moveUp, moveDown } = useListItemsContext();

  useEngravedHotkeys("ArrowUp", () => moveUp());
  useEngravedHotkeys("ArrowDown", () => moveDown());

  useEffect(() => {
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
};

const Host = styled("div")`
  &:focus {
    outline: 2px solid ${(p) => p.theme.palette.primary.main};
  }

  border-radius: ${paperBorderRadius};
`;
