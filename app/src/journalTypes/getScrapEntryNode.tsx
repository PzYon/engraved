import React from "react";
import { IJournal } from "../serverApi/IJournal";
import { IEntry } from "../serverApi/IEntry";
import { IScrapEntry } from "../serverApi/IScrapEntry";
import { Scrap } from "../components/details/scraps/Scrap";

export function getScrapEntryNode(
  journal: IJournal,
  entry: IEntry,
  hasFocus?: boolean,
  giveFocus?: () => void,
): React.ReactNode {
  return (
    <Scrap
      hasFocus={hasFocus}
      giveFocus={giveFocus}
      scrap={entry as IScrapEntry}
      journal={journal}
      propsRenderStyle={"all"}
    />
  );
}
