import { IEntity } from "../../../serverApi/IEntity";
import { IJournal } from "../../../serverApi/IJournal";
import { PageSection } from "../../layout/pages/PageSection";
import { OverviewList } from "../overviewList/OverviewList";
import { OverviewItemCollection } from "../overviewList/wrappers/OverviewItemCollection";
import { GoToTextField } from "./GoToTextField";
import { GoToItemRow } from "./GoToItemRow";
import { IScrapEntry } from "../../../serverApi/IScrapEntry";
import { useEngravedSearchParams } from "../../common/actions/searchParamHooks";
import { JournalIcon } from "../journals/JournalIcon";
import { IconStyle } from "../../common/IconStyle";
import { Icon } from "../../common/Icon";
import { Check, Notes } from "@mui/icons-material";
import { useGoToNavigationItems } from "./useGoToNavigationItems";
import { useDebounced } from "../../common/useDebounced";

export const GoTo: React.FC = () => {
  const { appendSearchParams, getSearchParam } = useEngravedSearchParams();
  const searchText = getSearchParam("q") ?? "";

  const debouncedSearchText = useDebounced(searchText);
  const items = useGoToNavigationItems(debouncedSearchText);

  return (
    <PageSection>
      <OverviewList
        items={items}
        renderBeforeList={(collection: OverviewItemCollection) => (
          <GoToTextField
            collection={collection}
            value={searchText}
            onChange={(value) => appendSearchParams({ q: value })}
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
      icon={
        <Icon style={IconStyle.Small}>
          {scrapEntry.scrapType === "List" ? <Check /> : <Notes />}
        </Icon>
      }
      url={`/journals/details/${scrapEntry.parentId}?selected-item=${scrapEntry.id}`}
      hasFocus={hasFocus}
    >
      {`${scrapEntry.title || scrapEntry.id}`}
    </GoToItemRow>
  );
};

const JournalGoToItemRow: React.FC<{
  journal: IJournal;
  hasFocus: boolean;
}> = ({ journal, hasFocus }) => {
  return (
    <GoToItemRow
      url={`/journals/details/${journal.id}`}
      hasFocus={hasFocus}
      icon={<JournalIcon journal={journal} iconStyle={IconStyle.Small} />}
    >
      {`${journal.name}`}
    </GoToItemRow>
  );
};
