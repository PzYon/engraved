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
  giveFocus?: () => void;
}> = ({ entry, giveFocus }) => {
  return (
    <Routes>
      <Route
        path={`/actions/delete/${entry.id}`}
        element={
          <NavigationActionContainer giveFocus={giveFocus}>
            <DeleteEntryAction entry={entry} />
          </NavigationActionContainer>
        }
      />
      <Route
        path={`/actions/schedule/${entry.id}`}
        element={
          <NavigationActionContainer giveFocus={giveFocus}>
            <EditScheduleAction entry={entry} />
          </NavigationActionContainer>
        }
      />
      <Route
        path={`/actions/notification-done/${entry.id}`}
        element={
          <NavigationActionContainer
            shrinkWidthIfPossible={true}
            giveFocus={giveFocus}
          >
            <NotificationDoneAction entry={entry} journal={null} />
          </NavigationActionContainer>
        }
      />
      <Route
        path={`/actions/move/${entry.id}`}
        element={
          <NavigationActionContainer giveFocus={giveFocus}>
            <MoveScrapAction entry={entry as IScrapEntry} />
          </NavigationActionContainer>
        }
      />
      <Route
        path={`/actions/edit/${entry.id}`}
        element={
          <NavigationActionContainer giveFocus={giveFocus}>
            <UpsertEntryAction entry={entry} />
          </NavigationActionContainer>
        }
      />
    </Routes>
  );
};
