import React from "react";
import Check from "@mui/icons-material/Check";
import Notes from "@mui/icons-material/Notes";
import { IScrapEntry } from "../../../serverApi/IScrapEntry";
import { IJournal } from "../../../serverApi/IJournal";
import { GoToItemRow } from "./GoToItemRow";
import { Icon } from "../Icon";
import { IconStyle } from "../IconStyle";
import { knownQueryParams } from "../actions/searchParamHooks";

export const ScrapEntryGoToItemRow: React.FC<{
  scrapEntry: IScrapEntry;
  journal?: IJournal;
  hasFocus: boolean;
  onClick?: () => void;
}> = ({ scrapEntry, journal, hasFocus, onClick }) => {
  return (
    <GoToItemRow
      icon={
        <Icon style={IconStyle.Small}>
          {scrapEntry.scrapType === "List" ? <Check /> : <Notes />}
        </Icon>
      }
      url={`/journals/details/${scrapEntry.parentId}?${knownQueryParams.selectedItemId}=${scrapEntry.id}`}
      hasFocus={hasFocus}
      onClick={onClick}
    >
      <span style={{ display: "flex", alignItems: "center" }}>
        {scrapEntry.title || getNotesExcerpt(scrapEntry.notes) || scrapEntry.id}
        <span
          style={{ fontSize: "smaller", color: "initial", paddingLeft: "10px" }}
        >
          {journal?.name}
        </span>
      </span>
    </GoToItemRow>
  );
};

// log book entries have no title, so we show the beginning of their notes instead
function getNotesExcerpt(notes: string | undefined): string | undefined {
  if (!notes) {
    return undefined;
  }

  const firstLine = notes.split("\n")[0];
  return firstLine.length > 60 ? firstLine.substring(0, 60) + "..." : firstLine;
}
