import { IEntry } from "../../../serverApi/IEntry";
import React from "react";
import { IJournal } from "../../../serverApi/IJournal";
import { IEntriesTableGroup } from "./IEntriesTableGroup";

export interface IEntriesTableColumnDefinition {
  key: string;

  getHeaderReactNode: (onClick: () => void) => React.ReactNode;

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

  getRawValue?: (entry: IEntry) => number;

  isSummable?: boolean;

  doHide?: (journal: IJournal) => boolean;

  getGroupKey?: (entry: IEntry) => string;

  width?: string;
}
