import { IJournal } from "../../../serverApi/IJournal";
import { NavigationActionContainer } from "../../common/entries/Entry";
import { DeleteJournal } from "../../details/edit/DeleteJournal";
import { EditSchedule } from "../../details/edit/EditSchedule";
import { NotificationDone } from "../../details/NotificationDone";
import { Route, Routes, useNavigate } from "react-router-dom";

export const JournalSubRoutes: React.FC<{
  journal: IJournal;
}> = ({ journal }) => {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route
        path={`/actions/${journal.id}/delete`}
        element={
          <NavigationActionContainer>
            <DeleteJournal journal={journal} onCancel={close} />
          </NavigationActionContainer>
        }
      />
      <Route
        path={`/actions/${journal.id}/schedule`}
        element={
          <NavigationActionContainer>
            <EditSchedule
              journalId={journal.id}
              entryId={null}
              journal={journal}
              onCancel={close}
            />
          </NavigationActionContainer>
        }
      />
      <Route
        path={`/actions/${journal.id}/notification-done`}
        element={
          <NavigationActionContainer>
            <NotificationDone
              entry={null}
              journal={journal}
              onSuccess={close}
            />
          </NavigationActionContainer>
        }
      />
    </Routes>
  );

  function close() {
    navigate("../");
  }
};
