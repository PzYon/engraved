import { IEntity } from "../../../serverApi/IEntity";
import { IJournal } from "../../../serverApi/IJournal";
import { PageSection } from "../../layout/pages/PageSection";
import { OverviewList } from "../overviewList/OverviewList";
import { GoToTextField } from "./GoToTextField";
import { GoToItemRow } from "./GoToItemRow";
import { IScrapEntry } from "../../../serverApi/IScrapEntry";
import {
  knownQueryParams,
  useEngravedSearchParams,
} from "../../common/actions/searchParamHooks";
import { JournalIcon } from "../journals/JournalIcon";
import { IconStyle } from "../../common/IconStyle";
import { Icon } from "../../common/Icon";
import { Check, Notes, SearchOutlined } from "@mui/icons-material";
import { useGoToNavigationItems } from "./useGoToNavigationItems";
import { useDebounced } from "../../common/useDebounced";
import { RefObject, useRef } from "react";

const emptyListItemId = "empty-list-item-id";

export const GoTo: React.FC = () => {
  const { appendSearchParams, getSearchParam } = useEngravedSearchParams();
  const searchText = getSearchParam("q") ?? "";

  const debouncedSearchText = useDebounced(searchText);
  const goto = useGoToNavigationItems(debouncedSearchText);

  const inputRef: RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);

  if (!goto.items.length && searchText) {
    goto.items.push({
      id: emptyListItemId,
    });
  }

  return (
    <PageSection>
      <OverviewList
        items={goto.items}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            return;
          }

          inputRef?.current.focus();
          appendSearchParams({ q: getValue(searchText, e.key) });
        }}
        renderBeforeList={(selectItem) => (
          <GoToTextField
            initialValue={searchText}
            onChange={(value) => {
              appendSearchParams({ q: value });
            }}
            inputRef={inputRef}
            onDownKey={() => selectItem(0)}
          />
        )}
        renderItem={(entity: IEntity, _: number, hasFocus: boolean) => {
          if (entity.id === emptyListItemId) {
            return (
              <GoToItemRow
                url={"/search?q=" + searchText}
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
        journal={goto.journalsForEntries.find(
          (j) => j.id === (entity as IScrapEntry).parentId,
        )}
        scrapEntry={entity as IScrapEntry}
        hasFocus={hasFocus}
      />
    );
  }
};

function getValue(value: string, key: string): string {
  if (key === "Backspace" || key === "Delete") {
    return value.substring(0, value.length - 1);
  } else if (key.length === 1) {
    return value + key;
  } else {
    // do nothing in case we don't know what ;)
    return value;
  }
}

const ScrapEntryGoToItemRow: React.FC<{
  scrapEntry: IScrapEntry;
  journal: IJournal;
  hasFocus: boolean;
}> = ({ scrapEntry, journal, hasFocus }) => {
  return (
    <GoToItemRow
      icon={
        <Icon style={IconStyle.Small}>
          {scrapEntry.scrapType === "List" ? <Check /> : <Notes />}
        </Icon>
      }
      url={`/journals/details/${scrapEntry.parentId}?${knownQueryParams.selectedItemId}=${scrapEntry.id}`}
      hasFocus={hasFocus}
    >
      <span style={{ display: "flex", alignItems: "center" }}>
        {`${scrapEntry.title || scrapEntry.id}`}
        <span
          style={{ fontSize: "smaller", color: "initial", paddingLeft: "10px" }}
        >
          {journal.name}
        </span>
      </span>
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
