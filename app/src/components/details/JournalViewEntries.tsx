import React from "react";
import { IJournal } from "../../serverApi/IJournal";
import { IEntry } from "../../serverApi/IEntry";
import { IDateConditions } from "./JournalContext";
import { PageSection } from "../layout/pages/PageSection";
import { Thresholds } from "./thresholds/Thresholds";
import { EntriesAgenda } from "./entriesAgenda/EntriesAgenda";
import { EntriesTable } from "./entriesTable/EntriesTable";
import { OfflinePlaceholder } from "../common/search/OfflinePlaceholder";
import { GenericEmptyPlaceholder } from "../common/search/GenericEmptyPlaceholder";
import LocalHotelOutlined from "@mui/icons-material/LocalHotelOutlined";
import { isTypeThatCanShowAddEntryRow } from "../../util/journalUtils";
import { AggregationMode, FooterRowMode } from "./edit/IJournalUiSettings";

export const JournalViewEntries: React.FC<{
  journal: IJournal;
  entries: IEntry[];
  showThresholds: boolean;
  dateConditions: IDateConditions;
  setSelectedAttributeValues: (
    attributeKey: string,
    attributeValueKeys: string[],
  ) => void;
  selectedAttributeValues: Record<string, string[]>;
  showAgenda: boolean;
  showStreak: boolean;
  showGroupTotals: boolean;
  showAddNewEntryRow: boolean;
  aggregationMode: AggregationMode;
  setAggregationMode: (mode: AggregationMode) => void;
  footerRowMode?: FooterRowMode;
  isOffline: boolean;
}> = ({
  journal,
  entries,
  showThresholds,
  dateConditions,
  setSelectedAttributeValues,
  selectedAttributeValues,
  showAgenda,
  showStreak,
  showGroupTotals,
  showAddNewEntryRow,
  aggregationMode,
  setAggregationMode,
  footerRowMode,
  isOffline,
}) => {
  return (
    <>
      {showThresholds && Object.keys(journal.thresholds ?? {}).length ? (
        <Thresholds
          entries={entries}
          journal={journal}
          dateConditions={dateConditions}
          setSelectedAttributeValues={setSelectedAttributeValues}
          selectedAttributeValues={selectedAttributeValues}
        />
      ) : null}

      {entries?.length ? (
        <>
          {showAgenda ? (
            <EntriesAgenda
              journal={journal}
              entries={entries}
              showStreak={showStreak}
            ></EntriesAgenda>
          ) : (
            <PageSection overflowXScroll={true} title="Entries">
              <EntriesTable
                journal={journal}
                entries={entries}
                showGroupTotals={showGroupTotals}
                showAddNewEntryRow={
                  showAddNewEntryRow &&
                  isTypeThatCanShowAddEntryRow(journal.type)
                }
                showStreak={showStreak}
                aggregationMode={aggregationMode}
                setAggregationMode={setAggregationMode}
                dateConditions={dateConditions}
                footerRowMode={footerRowMode}
              />
            </PageSection>
          )}
        </>
      ) : isOffline ? (
        <OfflinePlaceholder />
      ) : (
        <GenericEmptyPlaceholder
          icon={LocalHotelOutlined}
          message="No entries available."
        />
      )}
    </>
  );
};
