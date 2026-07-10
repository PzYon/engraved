import React from "react";
import { Typography } from "@mui/material";
import { useRelatedEntitiesQuery } from "../../../serverApi/reactQuery/queries/useRelatedEntitiesQuery";
import { IJournal } from "../../../serverApi/IJournal";
import { IScrapEntry } from "../../../serverApi/IScrapEntry";
import { JournalGoToItemRow } from "../../common/itemRows/JournalGoToItemRow";
import { ScrapEntryGoToItemRow } from "../../common/itemRows/ScrapEntryGoToItemRow";

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
            <JournalGoToItemRow
              key={journal.id}
              journal={journal}
              hasFocus={false}
            />
          );
        }

        const entry = searchResultEntity.entity as IScrapEntry;
        return (
          <ScrapEntryGoToItemRow
            key={entry.id}
            scrapEntry={entry}
            journal={result.journals.find((j) => j.id === entry.parentId)}
            hasFocus={false}
          />
        );
      })}
    </div>
  );
};
