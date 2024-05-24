import { IJournal } from "../../../serverApi/IJournal";
import { NavigationActionContainer } from "../../common/entries/Entry";
import { DeleteJournalAction } from "../../details/edit/DeleteJournalAction";
import { NotificationDoneAction } from "../../details/NotificationDoneAction";
import { Route, Routes } from "react-router-dom";
import { EditJournalPermissionsAction } from "../../details/edit/EditJournalPermissionsAction";
import React from "react";
import { UpsertEntryAction } from "../../details/add/UpsertEntryAction";
import { EditScheduleAction } from "../../details/edit/EditScheduleAction";

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
            <DeleteJournalAction journal={journal} />
          </NavigationActionContainer>
        }
      />
      <Route
        path={`actions/permissions/${journalId}`}
        element={
          <NavigationActionContainer>
            <EditJournalPermissionsAction journal={journal} />
          </NavigationActionContainer>
        }
      />
      <Route
        path={`actions/notification-done/${journalId}`}
        element={
          <NavigationActionContainer shrinkWidthIfPossible={true}>
            <NotificationDoneAction entry={null} journal={journal} />
          </NavigationActionContainer>
        }
      />
      <Route
        path={`actions/schedule/${journalId}`}
        element={
          <NavigationActionContainer>
            <EditScheduleAction journalId={journal.id} journal={journal} />
          </NavigationActionContainer>
        }
      />
      <Route
        path={`actions/add-entry/${journalId}`}
        element={
          <NavigationActionContainer>
            <UpsertEntryAction journal={journal} />
          </NavigationActionContainer>
        }
      />
    </Routes>
  );
};
