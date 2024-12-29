import { useState } from "react";
import { useSearchEntitiesQuery } from "../../../serverApi/reactQuery/queries/useSearchEntitiesQuery";
import { IEntity } from "../../../serverApi/IEntity";
import { IJournal } from "../../../serverApi/IJournal";
import { IScrapEntry } from "../../../serverApi/IScrapEntry";
import { PageSection } from "../../layout/pages/PageSection";
import { OverviewList } from "../overviewList/OverviewList";
import { OverviewItemCollection } from "../overviewList/wrappers/OverviewItemCollection";
import { GoToTextField } from "./GoToTextField";
import { GoToItemRow } from "./GoToItemRow";

export const GoTo: React.FC = () => {
  const [searchText, setSearchText] = useState("");

  const result = useSearchEntitiesQuery(searchText);

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
        renderItem={(entity) => <div>{renderItem(entity)}</div>}
        doNotUseUrl={true}
      />
    </PageSection>
  );

  function renderItem(entity: IEntity) {
    // this is a temporary hack! should be something like:
    // if (item.entityType === "Entry") {
    if ((entity as IJournal).type) {
      return (
        <GoToItemRow
          url={`/journals/${entity.id}`}
          title={`Journal ${entity.id}: ${(entity as IJournal).name}`}
        />
      );
    }

    return (
      <GoToItemRow
        url={`/journals/details/${(entity as IScrapEntry).parentId}?selected-item=${entity.id}`}
        title={`Entry ${entity.id}: ${(entity as IScrapEntry).title || entity.id}`}
      />
    );
  }
};