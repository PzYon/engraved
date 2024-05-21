import { IJournal } from "../../../serverApi/IJournal";
import { NavigationActionContainer } from "../../common/entries/Entry";
import { DeleteJournal } from "../../details/edit/DeleteJournal";
import { NotificationDone } from "../../details/NotificationDone";
import { Route, Routes } from "react-router-dom";
import { EditJournalPermissions } from "../../details/edit/EditJournalPermissions";
import React from "react";
import { UpsertEntry } from "../../details/add/UpsertEntry";
import { EditSchedule } from "../../details/edit/EditSchedule";

export const JournalSubRoutes: React.FC<{
  journal: IJournal;
  isFromDetailView?: boolean;
}> = ({ journal, isFromDetailView }) => {
  const journalId = isFromDetailView ? "" : journal.id;

  return (
    <Routes>
      <Route
        path={`actions/delete/${journalId}`}
        element={
          <NavigationActionContainer>
            <DeleteJournal journal={journal} />
          </NavigationActionContainer>
        }
      />
      <Route
        path={`actions/permissions/${journalId}`}
        element={
          <NavigationActionContainer>
            <EditJournalPermissions journal={journal} />
          </NavigationActionContainer>
        }
      />
      <Route
        path={`actions/notification-done/${journalId}`}
        element={
          <NavigationActionContainer shrinkWidthIfPossible={true}>
            <NotificationDone entry={null} journal={journal} />
          </NavigationActionContainer>
        }
      />
      <Route
        path={`actions/schedule/${journalId}`}
        element={
          <NavigationActionContainer>
            <EditSchedule journalId={journalId} journal={journal} />
          </NavigationActionContainer>
        }
      />
      <Route
        path={`actions/add-entry/${journalId}`}
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
