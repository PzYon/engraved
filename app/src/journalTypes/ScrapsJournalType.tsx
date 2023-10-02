import { JournalType } from "../serverApi/JournalType";
import { DynamicFeedOutlined } from "@mui/icons-material";
import { IJournalType } from "./IJournalType";
import { IEntriesTableColumnDefinition } from "../components/details/entriesTable/IEntriesTableColumnDefinition";
import { IJournal } from "../serverApi/IJournal";
import { IEntry } from "../serverApi/IEntry";
import React from "react";
import { Activity } from "./Activity";
import { Scrap } from "../components/details/scraps/Scrap";
import { IScrapEntry, ScrapType } from "../serverApi/IScrapEntry";

export class ScrapsJournalType implements IJournalType {
  type = JournalType.Scraps;

  isGroupable = false;

  getIcon() {
    return <DynamicFeedOutlined style={{ backgroundColor: "#DFEEFF" }} />;
  }

  getActivity(journal: IJournal, entry: IEntry): React.ReactNode {
    return (
      <Activity metric={journal} measurement={entry}>
        <Scrap
          scrap={entry as IScrapEntry}
          hideDate={true}
          withoutSection={true}
        />
      </Activity>
    );
  }

  getEntriesTableColumns(): IEntriesTableColumnDefinition[] {
    throw new Error(
      "getMeasurementsTableColumns is currently not supported for Scraps.",
    );
  }

  getValue(): number {
    throw new Error("getValue is currently not supported for Scraps.");
  }

  getYAxisLabel(): string {
    throw new Error("getYAxisLabel is currently not supported for Scraps.");
  }

  static createBlank(journalId: string, scrapType: ScrapType): IScrapEntry {
    return {
      id: null,
      parentId: journalId,
      dateTime: null,
      notes: "",
      title: "",
      scrapType: scrapType,
    };
  }
}
