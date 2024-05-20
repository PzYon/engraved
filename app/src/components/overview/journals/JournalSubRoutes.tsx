import { IJournal } from "../../../serverApi/IJournal";
import { NavigationActionContainer } from "../../common/entries/Entry";
import { DeleteJournal } from "../../details/edit/DeleteJournal";
import { NotificationDone } from "../../details/NotificationDone";
import { Route, Routes } from "react-router-dom";
import { EditJournalPermissions } from "../../details/edit/EditJournalPermissions";
import React from "react";
import { UpsertEntry } from "../../details/add/UpsertEntry";

export const JournalSubRoutes: React.FC<{
  journal: IJournal;
}> = ({ journal }) => {
  return (
    <Routes>
      <Route
        path={`actions/delete/${journal.id}`}
        element={
          <NavigationActionContainer>
            <DeleteJournal journal={journal} />
          </NavigationActionContainer>
        }
      />
      <Route
        path={`actions/permissions/${journal.id}`}
        element={
          <NavigationActionContainer>
            <EditJournalPermissions journal={journal} />
          </NavigationActionContainer>
        }
      />
      <Route
        path={`actions/notification-done/${journal.id}`}
        element={
          <NavigationActionContainer>
            <NotificationDone entry={null} journal={journal} />
          </NavigationActionContainer>
        }
      />
      <Route
        path={`actions/add-entry/${journal.id}`}
        element={
          <NavigationActionContainer>
            <UpsertEntry
              journal={journal}
              onSaved={() => {}}
              onCancel={() => {}}
            />
          </NavigationActionContainer>
        }
      />
    </Routes>
  );
};
