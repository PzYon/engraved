import { IEntity } from "../../../serverApi/IEntity";
import { IJournal } from "../../../serverApi/IJournal";
import { OverviewList } from "../overviewList/OverviewList";
import { GoToItemRow } from "./GoToItemRow";
import { IScrapEntry } from "../../../serverApi/IScrapEntry";
import { knownQueryParams } from "../../common/actions/searchParamHooks";
import { JournalIcon } from "../journals/JournalIcon";
import { IconStyle } from "../../common/IconStyle";
import { Icon } from "../../common/Icon";
import Check from "@mui/icons-material/Check";
import Notes from "@mui/icons-material/Notes";
import SearchOutlined from "@mui/icons-material/SearchOutlined";
import { useGoToNavigationItems } from "./useGoToNavigationItems";
import { ActionFactory } from "../../common/actions/ActionFactory";
import { ActionIconButton } from "../../common/actions/ActionIconButton";
import { DeviceWidth, useDeviceWidth } from "../../common/useDeviceWidth";
import { isTypeThatCanShowAddEntryRow } from "../../../util/journalUtils";
import { JournalType } from "../../../serverApi/JournalType";
import { useEffect } from "react";

const emptyListItemId = "empty-list-item-id";

export const GoToSimple: React.FC<{
  searchText?: string;
  onKeyDown?: (e: KeyboardEvent) => void;
  onClick?: () => void;
  renderBeforeList?: (selectItem: (index: number) => void) => React.ReactNode;
  hasDataLoaded?: () => void;
}> = ({ searchText, onKeyDown, onClick, renderBeforeList, hasDataLoaded }) => {
  const goto = useGoToNavigationItems(searchText);

  if (!goto.items.length && searchText) {
    goto.items.push({
      id: emptyListItemId,
    });
  }

  useEffect(() => {
    hasDataLoaded?.();
  }, [goto, hasDataLoaded]);

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
        <JournalGoToItemRow
          journal={entity as IJournal}
          hasFocus={hasFocus}
          onClick={onClick}
        />
      );
    }

    return (
      <ScrapEntryGoToItemRow
        journal={goto.journalsForEntries.find(
          (j) => j.id === (entity as IScrapEntry).parentId,
        )}
        scrapEntry={entity as IScrapEntry}
        hasFocus={hasFocus}
        onClick={onClick}
      />
    );
  }
};

const ScrapEntryGoToItemRow: React.FC<{
  scrapEntry: IScrapEntry;
  journal: IJournal;
  hasFocus: boolean;
  onClick: () => void;
}> = ({ scrapEntry, journal, hasFocus, onClick }) => {
  return (
    <GoToItemRow
      icon={
        <Icon style={IconStyle.Small}>
          {scrapEntry.scrapType === "List" ? <Check /> : <Notes />}
        </Icon>
      }
      url={`/journals/details/${scrapEntry.parentId}?${knownQueryParams.selectedItemId}=${scrapEntry.id}`}
      hasFocus={hasFocus}
      onClick={onClick}
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
  onClick: () => void;
}> = ({ journal, hasFocus, onClick }) => {
  const deviceWidth = useDeviceWidth();

  return (
    <GoToItemRow
      url={`/journals/details/${journal.id}`}
      onClick={onClick}
      hasFocus={hasFocus}
      icon={<JournalIcon journal={journal} iconStyle={IconStyle.Small} />}
      renderAtEnd={() => {
        return journal.type !== JournalType.Scraps ? (
          <ActionIconButton
            action={
              deviceWidth === DeviceWidth.Normal &&
              isTypeThatCanShowAddEntryRow(journal.type)
                ? ActionFactory.goToJournal(journal.id, false)
                : ActionFactory.addEntry(
                    journal,
                    false,
                    () => console.log("foo"),
                    true,
                  )
            }
          />
        ) : null;
      }}
    >
      {`${journal.name}`}
    </GoToItemRow>
  );
};
