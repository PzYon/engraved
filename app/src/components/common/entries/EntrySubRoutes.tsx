import { DeleteEntry } from "../../details/edit/DeleteEntry";
import { EditSchedule } from "../../details/edit/EditSchedule";
import { NotificationDone } from "../../details/NotificationDone";
import { MoveScrap } from "../../details/scraps/MoveScrap";
import { IScrapEntry } from "../../../serverApi/IScrapEntry";
import { NavigationActionContainer } from "./Entry";
import { Route, Routes } from "react-router-dom";
import { IEntry } from "../../../serverApi/IEntry";
import React from "react";
import { UpsertEntry } from "../../details/add/UpsertEntry";
import { useJournalQuery } from "../../../serverApi/reactQuery/queries/useJournalQuery";

export const EntrySubRoutes: React.FC<{
  entry: IEntry;
}> = ({ entry }) => {
  return (
    <Routes>
      <Route
        path={`/actions/delete/${entry.id}`}
        element={
          <NavigationActionContainer>
            <DeleteEntry entry={entry} />
          </NavigationActionContainer>
        }
      />
      <Route
        path={`/actions/schedule/${entry.id}`}
        element={
          <NavigationActionContainer>
            <EditSchedule journalId={""} entryId={entry.id} journal={null} />
          </NavigationActionContainer>
        }
      />
      <Route
        path={`/actions/notification-done/${entry.id}`}
        element={
          <NavigationActionContainer shrinkWidthIfPossible={true}>
            <NotificationDone entry={entry} journal={null} />
          </NavigationActionContainer>
        }
      />
      <Route
        path={`/actions/move/${entry.id}`}
        element={
          <NavigationActionContainer>
            <MoveScrap entry={entry as IScrapEntry} />
          </NavigationActionContainer>
        }
      />
      <Route
        path={`/actions/edit/${entry.id}`}
        element={
          <NavigationActionContainer>
            <UpsertEntryLoader entry={entry} />
          </NavigationActionContainer>
        }
      />
    </Routes>
  );
};

const UpsertEntryLoader: React.FC<{ entry: IEntry }> = ({ entry }) => {
  const journal = useJournalQuery(entry.parentId);

  if (!journal) {
    return null;
  }

  return <UpsertEntry journal={journal} entry={entry} />;
};
