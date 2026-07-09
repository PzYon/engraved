import React from "react";
import { Typography } from "@mui/material";
import Check from "@mui/icons-material/Check";
import Notes from "@mui/icons-material/Notes";
import { useRelatedEntitiesQuery } from "../../../serverApi/reactQuery/queries/useRelatedEntitiesQuery";
import { IJournal } from "../../../serverApi/IJournal";
import { IScrapEntry } from "../../../serverApi/IScrapEntry";
import { GoToItemRow } from "../../overview/goto/GoToItemRow";
import { JournalIcon } from "../../overview/journals/JournalIcon";
import { Icon } from "../../common/Icon";
import { IconStyle } from "../../common/IconStyle";
import { knownQueryParams } from "../../common/actions/searchParamHooks";

export const RelatedItemsAction: React.FC<{
  entityId: string;
  entityType: "Journal" | "Entry";
}> = ({ entityId, entityType }) => {
  const { data: result, isFetching } = useRelatedEntitiesQuery(
    entityId,
    entityType,
  );

  if (!result) {
    return isFetching ? (
      <Typography>Looking for related items...</Typography>
    ) : null;
  }

  if (!result.entities?.length) {
    return <Typography>No related items found.</Typography>;
  }

  return (
    <div>
      {result.entities.map((searchResultEntity) => {
        if (searchResultEntity.entityType === "Journal") {
          const journal = searchResultEntity.entity as IJournal;
          return (
            <GoToItemRow
              key={journal.id}
              url={`/journals/details/${journal.id}`}
              hasFocus={false}
              icon={
                <JournalIcon journal={journal} iconStyle={IconStyle.Small} />
              }
            >
              {journal.name}
            </GoToItemRow>
          );
        }

        const entry = searchResultEntity.entity as IScrapEntry;
        const parentJournal = result.journals.find(
          (j) => j.id === entry.parentId,
        );

        return (
          <GoToItemRow
            key={entry.id}
            url={`/journals/details/${entry.parentId}?${knownQueryParams.selectedItemId}=${entry.id}`}
            hasFocus={false}
            icon={
              <Icon style={IconStyle.Small}>
                {entry.scrapType === "List" ? <Check /> : <Notes />}
              </Icon>
            }
          >
            <span style={{ display: "flex", alignItems: "center" }}>
              {entry.title || getNotesExcerpt(entry.notes) || entry.id}
              <span
                style={{
                  fontSize: "smaller",
                  color: "initial",
                  paddingLeft: "10px",
                }}
              >
                {parentJournal?.name}
              </span>
            </span>
          </GoToItemRow>
        );
      })}
    </div>
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
