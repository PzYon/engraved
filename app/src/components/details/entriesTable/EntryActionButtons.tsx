import { IEntry } from "../../../serverApi/IEntry";
import { ActionIconButton } from "../../common/actions/ActionIconButton";
import React from "react";
import { styled } from "@mui/material";
import { ActionFactory } from "../../common/actions/ActionFactory";

export const EntryActionButtons: React.FC<{
  entry: IEntry;
}> = ({ entry }) => (
  <Host>
    <ActionIconButton action={ActionFactory.editEntry(entry)} />
    <ActionIconButton action={ActionFactory.deleteEntry(entry)} />
  </Host>
);

const Host = styled("div")`
  min-width: 80px;
  display: flex;
`;
