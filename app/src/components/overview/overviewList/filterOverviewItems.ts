import { IEntity } from "../../../serverApi/IEntity";
import { IJournal } from "../../../serverApi/IJournal";
import { IScrapEntry } from "../../../serverApi/IScrapEntry";

export function filterOverviewItems(
  items: IEntity[],
  searchText: string | undefined,
  showAll: boolean,
  filterItem?: (item: IEntity) => boolean,
): IEntity[] {
  if (searchText) {
    const lowerCasedSearchText = searchText.toLowerCase();

    return items.filter((item) =>
      getSearchableText(item)?.toLowerCase().includes(lowerCasedSearchText),
    );
  }

  return items.filter((item) => (showAll || filterItem?.(item)) ?? true);
}

function getSearchableText(item: IEntity): string | undefined {
  return (item as IJournal).name || (item as IScrapEntry).title;
}
