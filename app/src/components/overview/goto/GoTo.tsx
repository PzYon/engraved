import { useState } from "react";
import { useSearchEntitiesQuery } from "../../../serverApi/reactQuery/queries/useSearchEntitiesQuery";
import { IEntity } from "../../../serverApi/IEntity";
import { IJournal } from "../../../serverApi/IJournal";
import { PageSection } from "../../layout/pages/PageSection";
import { OverviewList } from "../overviewList/OverviewList";
import { OverviewItemCollection } from "../overviewList/wrappers/OverviewItemCollection";
import { GoToTextField } from "./GoToTextField";
import { GoToItemRow } from "./GoToItemRow";
import { JournalType } from "../../../serverApi/JournalType";
import { IScrapEntry } from "../../../serverApi/IScrapEntry";

export const GoTo: React.FC = () => {
  const [searchText, setSearchText] = useState("");

  const result = useSearchEntitiesQuery(
    searchText,
    false,
    [JournalType.Scraps],
    false,
    true,
  );

  return (
    <PageSection>
      <OverviewList
        items={result?.entities?.map((entity) => entity.entity) ?? []}
        renderBeforeList={(collection: OverviewItemCollection) => (
          <GoToTextField
            collection={collection}
            value={searchText}
            onChange={setSearchText}
          />
        )}
        renderItem={(entity: IEntity, _: number, hasFocus: boolean) =>
          renderItem(entity, hasFocus)
        }
        doNotUseUrl={true}
      />
    </PageSection>
  );

  function renderItem(entity: IEntity, hasFocus: boolean) {
    // this is a temporary hack! should be something like:
    // if (item.entityType === "Entry") {
    if ((entity as IJournal).type) {
      return (
        <JournalGoToItemRow journal={entity as IJournal} hasFocus={hasFocus} />
      );
    }

    return (
      <ScrapEntryGoToItemRow
        scrapEntry={entity as IScrapEntry}
        hasFocus={hasFocus}
      />
    );
  }
};

const ScrapEntryGoToItemRow: React.FC<{
  scrapEntry: IScrapEntry;
  hasFocus: boolean;
}> = ({ scrapEntry, hasFocus }) => {
  return (
    <GoToItemRow
      url={`/journals/details/${scrapEntry.parentId}?selected-item=${scrapEntry.id}`}
      title={`Entry: ${scrapEntry.title || scrapEntry.id}`}
      hasFocus={hasFocus}
    />
  );
};

const JournalGoToItemRow: React.FC<{
  journal: IJournal;
  hasFocus: boolean;
}> = ({ journal, hasFocus }) => {
  return (
    <GoToItemRow
      url={`/journals/details/${journal.id}`}
      title={`Journal: ${journal.name}`}
      hasFocus={hasFocus}
    />
  );
};
