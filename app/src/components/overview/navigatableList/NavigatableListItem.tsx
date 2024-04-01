import React, { useEffect, useRef } from "react";
import { IEntity } from "../../../serverApi/IEntity";
import { IJournal } from "../../../serverApi/IJournal";
import { paperBorderRadius } from "../../../theming/engravedTheme";
import { styled } from "@mui/material";
import { WrapperCollectionItem } from "./wrappers/WrapperCollectionItem";

export const NavigatableListItem: React.FC<{
  children: React.ReactNode;
  onClick: () => void;
  addWrapperItem: (wrapper: WrapperCollectionItem) => void;
  item: IEntity;
  index: number;
}> = ({ children, onClick, addWrapperItem, item, index }) => {
  const domElementRef = useRef<HTMLDivElement>();

  useEffect(() => {
    addWrapperItem(new WrapperCollectionItem(domElementRef, item as IJournal));
  }, [addWrapperItem, item]);

  return (
    <Host ref={domElementRef} onClick={onClick} tabIndex={index}>
      {children}
    </Host>
  );
};

const Host = styled("div")`
  &:focus {
    outline: 2px solid ${(p) => p.theme.palette.primary.main};
  }

  border-radius: ${paperBorderRadius};
`;
