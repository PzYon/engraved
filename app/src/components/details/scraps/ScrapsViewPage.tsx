import React, { useEffect, useState } from "react";
import { Scrap } from "./Scrap";
import {
  CheckBoxOutlined,
  FormatAlignLeftOutlined,
  SelfImprovementOutlined,
} from "@mui/icons-material";
import { useJournalContext } from "../JournalContext";
import { JournalPageTitle } from "../JournalPageTitle";
import { getCommonActions } from "../../overview/getCommonActions";
import { Page } from "../../layout/pages/Page";
import { IScrapEntry, ScrapType } from "../../../serverApi/IScrapEntry";
import { Route, Routes } from "react-router-dom";
import { DeleteEntryLauncher } from "../edit/DeleteEntryLauncher";
import { GenericEmptyPlaceholder } from "../../common/search/GenericEmptyPlaceholder";
import { EditScheduleLauncher } from "../edit/EditScheduleLauncher";
import { useAppContext } from "../../../AppContext";
import { OnNotificationLauncher } from "../OnNotificationLauncher";
import { ScrapToc } from "./ScrapToc";
import { ScrapsJournalType } from "../../../journalTypes/ScrapsJournalType";
import { IAction } from "../../common/actions/IAction";
import { IEntity } from "../../../serverApi/IEntity";
import { compareAsc } from "date-fns";
import { ActionFactory } from "../../common/actions/ActionFactory";
import { NavigatableList } from "../../overview/navigatableList/NavigatableList";

export const ScrapsViewPage: React.FC = () => {
  const { journal, entries: scraps, setDateConditions } = useJournalContext();
  const { user } = useAppContext();

  const [newScrap, setNewScrap] = useState<IScrapEntry>(null);
  const [showToc, setShowToc] = useState(false);

  useEffect(() => {
    // we need to set date conditions in order for data to be loaded
    setDateConditions({});
  }, [setDateConditions]);

  useEffect(() => {
    setNewScrap(null);
  }, [scraps]);

  // alt+s (save) is handled by code mirror resp. list

  if (!journal) {
    return;
  }

  return (
    <Page
      title={<JournalPageTitle journal={journal} />}
      documentTitle={journal.name}
      actions={[
        getAddNewAction("markdown"),
        getAddNewAction("list"),
        null,
        ActionFactory.getToc(() => setShowToc(!showToc)),
        ...getCommonActions(journal, false),
      ]}
    >
      {showToc ? <ScrapToc entries={scraps as IScrapEntry[]} /> : null}

      {newScrap ? (
        <Scrap
          key="new"
          scrap={newScrap}
          hasFocus={true}
          journalName={null}
          propsRenderStyle={"none"}
        />
      ) : null}

      {scraps.length ? (
        <NavigatableList
          items={scraps.sort(getCompareFn(user.id))}
          renderItem={(item, index, isFocused) => {
            return (
              <Scrap
                key={item.id + item.schedules[user.id]?.nextOccurrence}
                journalName={journal.name}
                propsRenderStyle={"generic"}
                scrap={item as IScrapEntry}
                hasFocus={isFocused}
              />
            );
          }}
        ></NavigatableList>
      ) : null}

      {!scraps.length && !newScrap ? (
        <GenericEmptyPlaceholder
          icon={SelfImprovementOutlined}
          message={"Nothing here..."}
        />
      ) : null}

      <Routes>
        <Route
          path="/entries/:entryId/delete"
          element={<DeleteEntryLauncher journal={journal} />}
        />
        <Route
          path="/entries/:entryId/schedule"
          element={<EditScheduleLauncher journal={journal} />}
        />
        <Route
          path="/entries/:entryId/notification"
          element={<OnNotificationLauncher journal={journal} />}
        />
      </Routes>
    </Page>
  );

  function getAddNewAction(type: "markdown" | "list"): IAction {
    const isMarkdown = type === "markdown";

    return {
      hotkey: isMarkdown ? "alt+m" : "alt+l",
      key: "add-scrap-" + type,
      label: "Add " + type,
      icon: isMarkdown ? <MarkdownScrapIcon /> : <ListScrapIcon />,
      onClick: () => {
        setNewScrap(
          ScrapsJournalType.createBlank(
            journal.id,
            isMarkdown ? ScrapType.Markdown : ScrapType.List,
          ),
        );
      },
    };
  }
};

export const MarkdownScrapIcon = () => {
  return <FormatAlignLeftOutlined fontSize="small" />;
};

export const ListScrapIcon = () => {
  return <CheckBoxOutlined fontSize="small" />;
};

function getCompareFn(userId: string) {
  return (a: IEntity, b: IEntity) => {
    const nextOccurrenceA = a.schedules[userId]?.nextOccurrence;
    const nextOccurrenceB = b.schedules[userId]?.nextOccurrence;

    if (nextOccurrenceA && nextOccurrenceB) {
      return compareAsc(new Date(nextOccurrenceA), new Date(nextOccurrenceB));
    }

    if (nextOccurrenceA) {
      return -1;
    }

    if (nextOccurrenceB) {
      return 1;
    }

    return 0;
  };
}
