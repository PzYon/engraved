import { IEntry } from "../../../serverApi/IEntry";
import React from "react";
import { IJournal } from "../../../serverApi/IJournal";
import { IEntriesTableGroup } from "./IEntriesTableGroup";

export interface IEntriesTableColumnDefinition {
  key: string;

  getHeaderReactNode: (onClick: () => void) => React.ReactNode;

  getValueReactNode: (
    group: IEntriesTableGroup,
    measurement: IEntry,
    isFirstRowOfGroup: boolean,
    onClick?: () => void,
  ) => React.ReactNode;

  getGroupReactNode?: (
    group: IEntriesTableGroup,
    onClick?: () => void,
  ) => React.ReactNode;

  getRawValue?: (measurement: IEntry) => number;

  isSummable?: boolean;

  doHide?: (metric: IJournal) => boolean;

  getGroupKey?: (measurement: IEntry) => string;

  width?: string;
}
