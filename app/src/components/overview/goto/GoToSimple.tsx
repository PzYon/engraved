import { IEntity } from "../../../serverApi/IEntity";
import { IJournal } from "../../../serverApi/IJournal";
import { OverviewList } from "../overviewList/OverviewList";
import { GoToItemRow } from "../../common/itemRows/GoToItemRow";
import { JournalGoToItemRow } from "../../common/itemRows/JournalGoToItemRow";
import { ScrapEntryGoToItemRow } from "../../common/itemRows/ScrapEntryGoToItemRow";
import { IScrapEntry } from "../../../serverApi/IScrapEntry";
import { knownQueryParams } from "../../common/actions/searchParamHooks";
import SearchOutlined from "@mui/icons-material/SearchOutlined";
import { useGoToNavigationItems } from "./useGoToNavigationItems";

const emptyListItemId = "empty-list-item-id";

export const GoToSimple: React.FC<{
  searchText?: string;
  onKeyDown?: (e: KeyboardEvent) => void;
  renderBeforeList?: (selectItem: (index: number) => void) => React.ReactNode;
}> = ({ searchText, onKeyDown, renderBeforeList }) => {
  const goto = useGoToNavigationItems(searchText);

  if (!goto.isLoading && !goto.items.length && searchText) {
    goto.items.push({
      id: emptyListItemId,
    });
  }

  return (
    <OverviewList
      items={goto.items}
      onKeyDown={onKeyDown}
      renderBeforeList={renderBeforeList}
      renderItem={(entity: IEntity, _: number, hasFocus: boolean) => {
        if (entity.id === emptyListItemId) {
          return (
            <GoToItemRow
              url={`/search?${knownQueryParams.query}=${searchText}`}
              hasFocus={hasFocus}
              icon={<SearchOutlined />}
            >
              Nothing found, would you like to search for &quot;{searchText}
              &quot; instead?
            </GoToItemRow>
          );
        }

        return renderItem(entity, hasFocus);
      }}
    />
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
        journal={goto.journalsForEntries.find(
          (j) => j.id === (entity as IScrapEntry).parentId,
        )}
        scrapEntry={entity as IScrapEntry}
        hasFocus={hasFocus}
      />
    );
  }
};
