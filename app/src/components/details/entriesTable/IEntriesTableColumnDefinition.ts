import { IEntry } from "../../../serverApi/IEntry";
import React from "react";
import { IJournal } from "../../../serverApi/IJournal";
import { IEntriesTableGroup } from "./IEntriesTableGroup";
import { IUpsertGaugeEntryCommand } from "../../../serverApi/commands/IUpsertGaugeEntryCommand";

export interface IEntriesTableColumnDefinition {
  key: string;

  getHeaderReactNode: (
    onClick?: () => void,
    journal?: IJournal,
  ) => React.ReactNode;

  getValueReactNode: (
    group: IEntriesTableGroup,
    entry: IEntry,
    isFirstRowOfGroup: boolean,
    onClick?: () => void,
  ) => React.ReactNode;

  getGroupReactNode?: (
    group: IEntriesTableGroup,
    onClick?: () => void,
  ) => React.ReactNode;

  getAddEntryReactNode?: (
    command: IUpsertGaugeEntryCommand,
    updateCommand: (
      command: IUpsertGaugeEntryCommand,
      isReset?: boolean,
    ) => void,
  ) => React.ReactNode;

  getRawValue?: (entry: IEntry) => number;

  isAggregatable?: boolean;

  doHide?: (journal: IJournal) => boolean;

  getGroupKey?: (entry: IEntry) => string;

  width?: string;

  minWidth?: string;

  maxWidth?: string;
}
