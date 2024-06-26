import React, { useEffect, useState } from "react";
import { Scrap } from "./Scrap";
import {
  CheckBoxOutlined,
  FormatAlignLeftOutlined,
  SelfImprovementOutlined,
} from "@mui/icons-material";
import { useJournalContext } from "../JournalContext";
import { JournalPageTitle } from "../JournalPageTitle";
import { getCommonJournalActions } from "../../overview/getCommonJournalActions";
import { Page } from "../../layout/pages/Page";
import { IScrapEntry, ScrapType } from "../../../serverApi/IScrapEntry";
import { GenericEmptyPlaceholder } from "../../common/search/GenericEmptyPlaceholder";
import { useAppContext } from "../../../AppContext";
import { ScrapToc } from "./ScrapToc";
import { ScrapsJournalType } from "../../../journalTypes/ScrapsJournalType";
import { IAction } from "../../common/actions/IAction";
import { IEntity } from "../../../serverApi/IEntity";
import { compareAsc } from "date-fns";
import { ActionFactory } from "../../common/actions/ActionFactory";
import { OverviewList } from "../../overview/overviewList/OverviewList";
import { getScheduleForUser } from "../../overview/scheduled/scheduleUtils";
import { PageSection } from "../../layout/pages/PageSection";
import { JournalSubRoutes } from "../../overview/journals/JournalSubRoutes";

export const ScrapsViewPage: React.FC = () => {
  const { journal, entries: scraps, setDateConditions } = useJournalContext();
  const { user } = useAppContext();

  const [newScrap, setNewScrap] = useState<IScrapEntry>(null);
  const [showToc, setShowToc] = useState(true);

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
        ...getCommonJournalActions(journal, false, user, true),
      ]}
    >
      <JournalSubRoutes journal={journal} isFromDetailView={true} />

      {showToc ? <ScrapToc entries={scraps as IScrapEntry[]} /> : null}

      {newScrap ? (
        <PageSection>
          <Scrap
            key="new"
            scrap={newScrap}
            hasFocus={true}
            journal={null}
            propsRenderStyle={"none"}
          />
        </PageSection>
      ) : null}

      {scraps.length ? (
        <OverviewList
          items={scraps.sort(getCompareFn(user.id))}
          renderItem={(item, _, hasFocus, giveFocus) => (
            <Scrap
              key={item.id + getScheduleForUser(item, user.id).nextOccurrence}
              journal={journal}
              propsRenderStyle={"generic"}
              scrap={item as IScrapEntry}
              hasFocus={hasFocus}
              giveFocus={giveFocus}
            />
          )}
        />
      ) : null}

      {!scraps.length && !newScrap ? (
        <GenericEmptyPlaceholder
          icon={SelfImprovementOutlined}
          message={"Nothing here..."}
        />
      ) : null}
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
        const entry = ScrapsJournalType.createBlank(
          journal.id,
          isMarkdown ? ScrapType.Markdown : ScrapType.List,
        );

        setNewScrap(entry);
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
    const nextOccurrenceA = getScheduleForUser(a, userId).nextOccurrence;
    const nextOccurrenceB = getScheduleForUser(b, userId).nextOccurrence;

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
