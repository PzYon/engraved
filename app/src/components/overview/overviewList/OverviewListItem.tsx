import React, { useEffect, useRef } from "react";
import { IEntity } from "../../../serverApi/IEntity";
import { IJournal } from "../../../serverApi/IJournal";
import { paperBorderRadius } from "../../../theming/engravedTheme";
import { styled } from "@mui/material";
import { OverviewItem } from "./wrappers/OverviewItem";
import { PageSection } from "../../layout/pages/PageSection";
import { useDisplayModeContext } from "./DisplayModeContext";

export const OverviewListItem: React.FC<{
  children: React.ReactNode;
  onClick: () => void;
  addWrapperItem: (wrapper: OverviewItem) => void;
  item: IEntity;
  index: number;
}> = ({ children, onClick, addWrapperItem, item, index }) => {
  const domElementRef = useRef<HTMLDivElement>();

  const { isCompact } = useDisplayModeContext();

  useEffect(() => {
    addWrapperItem(new OverviewItem(domElementRef, item as IJournal));
  }, [addWrapperItem, item]);

  return (
    <Host
      ref={domElementRef}
      onClick={onClick}
      tabIndex={index}
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
