import { IJournal } from "../../../serverApi/IJournal";
import { NavigationActionContainer } from "../../common/entries/Entry";
import { DeleteJournal } from "../edit/DeleteJournal";
import { EditSchedule } from "../edit/EditSchedule";
import { EditJournalPermissions } from "../edit/EditJournalPermissions";
import { Route, Routes } from "react-router-dom";

export const JournalDetailSubRoutes: React.FC<{ journal: IJournal }> = ({
  journal,
}) => {
  return (
    <Routes>
      <Route
        path={`actions/delete`}
        element={
          <NavigationActionContainer>
            <DeleteJournal journal={journal} />
          </NavigationActionContainer>
        }
      />
      <Route
        path={`actions/schedule`}
        element={
          <NavigationActionContainer>
            <EditSchedule
              journalId={journal.id}
              entryId={null}
              journal={journal}
            />
          </NavigationActionContainer>
        }
      />
      <Route
        path={`actions/permissions`}
        element={
          <NavigationActionContainer>
            <EditJournalPermissions journal={journal} />
          </NavigationActionContainer>
        }
      />
    </Routes>
  );
};
