import { DeleteEntryAction } from "../../details/edit/DeleteEntryAction";
import { EditScheduleAction } from "../../details/edit/EditScheduleAction";
import { NotificationDoneAction } from "../../details/NotificationDoneAction";
import { MoveScrapAction } from "../../details/scraps/MoveScrapAction";
import { IScrapEntry } from "../../../serverApi/IScrapEntry";
import { NavigationActionContainer } from "./Entry";
import { Route, Routes } from "react-router-dom";
import { IEntry } from "../../../serverApi/IEntry";
import React from "react";
import { UpsertEntryAction } from "../../details/add/UpsertEntryAction";

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
            <EditScheduleAction entry={entry} />
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
          <NavigationActionContainer>
            <UpsertEntryAction entry={entry} />
          </NavigationActionContainer>
        }
      />
    </Routes>
  );
};
