import { IJournal } from "../../../serverApi/IJournal";
import { NavigationActionContainer } from "../../common/entries/Entry";
import { DeleteJournalAction } from "../../details/edit/DeleteJournalAction";
import { NotificationDoneAction } from "../../details/NotificationDoneAction";
import { Route, Routes, useSearchParams } from "react-router-dom";
import { EditJournalPermissionsAction } from "../../details/edit/EditJournalPermissionsAction";
import React from "react";
import { UpsertEntryAction } from "../../details/add/UpsertEntryAction";
import { EditScheduleAction } from "../../details/edit/EditScheduleAction";

export const JournalSubRoutes: React.FC<{
  journal: IJournal;
  isFromDetailView?: boolean;
  giveFocus?: () => void;
}> = ({ journal, isFromDetailView, giveFocus }) => {
  const journalId = isFromDetailView ? "" : journal.id;

  const [searchParams] = useSearchParams();

  const actionKey = searchParams.get("action-key");
  const actionItemId = searchParams.get("action-item-id");

  if (actionItemId !== journal.id) {
    return null;
  }

  switch (actionKey) {
    case "delete":
      return (
        <NavigationActionContainer giveFocus={giveFocus}>
          <DeleteJournalAction journal={journal} />
        </NavigationActionContainer>
      );
    case "permissions":
      return (
        <NavigationActionContainer giveFocus={giveFocus}>
          <EditJournalPermissionsAction journal={journal} />
        </NavigationActionContainer>
      );
  }

  return (
    <Routes>
      <Route
        path={`actions/delete/${journalId}`}
        element={
          <NavigationActionContainer giveFocus={giveFocus}>
            <DeleteJournalAction journal={journal} />
          </NavigationActionContainer>
        }
      />
      <Route
        path={`actions/permissions/${journalId}`}
        element={
          <NavigationActionContainer giveFocus={giveFocus}>
            <EditJournalPermissionsAction journal={journal} />
          </NavigationActionContainer>
        }
      />
      <Route
        path={`actions/notification-done/${journalId}`}
        element={
          <NavigationActionContainer
            shrinkWidthIfPossible={true}
            giveFocus={giveFocus}
          >
            <NotificationDoneAction entry={null} journal={journal} />
          </NavigationActionContainer>
        }
      />
      <Route
        path={`actions/schedule/${journalId}`}
        element={
          <NavigationActionContainer giveFocus={giveFocus}>
            <EditScheduleAction journal={journal} />
          </NavigationActionContainer>
        }
      />
      <Route
        path={`actions/add-entry/${journalId}`}
        element={
          <NavigationActionContainer giveFocus={giveFocus}>
            <UpsertEntryAction journal={journal} />
          </NavigationActionContainer>
        }
      />
    </Routes>
  );
};
