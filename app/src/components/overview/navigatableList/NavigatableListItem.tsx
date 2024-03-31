import { IEntity } from "../../../serverApi/IEntity";
import { JournalItemWrapper } from "../JournalItemWrapper";
import { IJournal } from "../../../serverApi/IJournal";
import { paperBorderRadius } from "../../../theming/engravedTheme";
import { useEffect, useRef } from "react";
import { styled } from "@mui/material";

export const NavigatableListItem: React.FC<{
  children: React.ReactNode;
  onClick: () => void;
  addWrapperItem: (wrapper: JournalItemWrapper) => void;
  item: IEntity;
  index: number;
}> = ({ children, onClick, addWrapperItem, item, index }) => {
  useEffect(() => {
    addWrapperItem?.(new JournalItemWrapper(domElementRef, item as IJournal));
  }, [addWrapperItem, item]);

  const domElementRef = useRef<HTMLDivElement>();

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
