import { DeleteEntryAction } from "../../details/edit/DeleteEntryAction";
import { EditScheduleAction } from "../../details/edit/EditScheduleAction";
import { NotificationDoneAction } from "../../details/NotificationDoneAction";
import { MoveScrapAction } from "../../details/scraps/MoveScrapAction";
import { IScrapEntry } from "../../../serverApi/IScrapEntry";
import { NavigationActionContainer } from "./Entry";
import { Route, Routes } from "react-router-dom";
import { IEntry } from "../../../serverApi/IEntry";
import React from "react";
import { UpsertEntryActionLoader } from "../../details/add/UpsertEntryActionLoader";
import { EditScrapLauncher } from "./EditScrapLauncher";

export const EntrySubRoutes: React.FC<{
  entry: IEntry;
}> = ({ entry }) => {
  return (
    <Routes>
      <Route
        path={`/actions/delete/${entry.id}`}
        element={
          <NavigationActionContainer>
            <DeleteEntryAction entry={entry} />
          </NavigationActionContainer>
        }
      />
      <Route
        path={`/actions/schedule/${entry.id}`}
        element={
          <NavigationActionContainer>
            <EditScheduleAction
              journalId={""}
              entryId={entry.id}
              journal={null}
            />
          </NavigationActionContainer>
        }
      />
      <Route
        path={`/actions/notification-done/${entry.id}`}
        element={
          <NavigationActionContainer shrinkWidthIfPossible={true}>
            <NotificationDoneAction entry={entry} journal={null} />
          </NavigationActionContainer>
        }
      />
      <Route
        path={`/actions/move/${entry.id}`}
        element={
          <NavigationActionContainer>
            <MoveScrapAction entry={entry as IScrapEntry} />
          </NavigationActionContainer>
        }
      />
      <Route
        path={`/actions/edit/${entry.id}`}
        element={
          (entry as IScrapEntry).scrapType ? (
            <EditScrapLauncher />
          ) : (
            <NavigationActionContainer shrinkWidthIfPossible={true}>
              <UpsertEntryActionLoader entry={entry} />
            </NavigationActionContainer>
          )
        }
      />
    </Routes>
  );
};
