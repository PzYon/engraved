import { DeleteEntry } from "../../details/edit/DeleteEntry";
import { EditSchedule } from "../../details/edit/EditSchedule";
import { NotificationDone } from "../../details/NotificationDone";
import { MoveScrap } from "../../details/scraps/MoveScrap";
import { IScrapEntry } from "../../../serverApi/IScrapEntry";
import { NavigationActionContainer } from "./Entry";
import { Route, Routes } from "react-router-dom";
import { IEntry } from "../../../serverApi/IEntry";
import React from "react";

export const EntrySubRoutes: React.FC<{
  entry: IEntry;
}> = ({ entry }) => {
  return (
    <Routes>
      <Route
        path={`/actions/${entry.id}/delete`}
        element={
          <NavigationActionContainer>
            <DeleteEntry entry={entry} />
          </NavigationActionContainer>
        }
      />
      <Route
        path={`/actions/${entry.id}/schedule`}
        element={
          <NavigationActionContainer>
            <EditSchedule journalId={""} entryId={entry.id} journal={null} />
          </NavigationActionContainer>
        }
      />
      <Route
        path={`/actions/${entry.id}/notification-done`}
        element={
          <NavigationActionContainer>
            <NotificationDone entry={entry} journal={null} />
          </NavigationActionContainer>
        }
      />
      <Route
        path={`/actions/${entry.id}/move`}
        element={
          <NavigationActionContainer>
            <MoveScrap entry={entry as IScrapEntry} />
          </NavigationActionContainer>
        }
      />
    </Routes>
  );
};
