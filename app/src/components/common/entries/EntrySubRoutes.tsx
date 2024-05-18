import { DeleteEntry } from "../../details/edit/DeleteEntry";
import { EditSchedule } from "../../details/edit/EditSchedule";
import { NotificationDone } from "../../details/NotificationDone";
import { MoveScrap } from "../../details/scraps/MoveScrap";
import { IScrapEntry } from "../../../serverApi/IScrapEntry";
import { NavigationActionContainer } from "./Entry";
import { Route, Routes, useNavigate } from "react-router-dom";
import { IEntry } from "../../../serverApi/IEntry";

export const EntrySubRoutes: React.FC<{
  entry: IEntry;
}> = ({ entry }) => {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route
        path={`/${entry.id}/delete`}
        element={
          <NavigationActionContainer>
            <DeleteEntry entry={entry} onCancel={close} />
          </NavigationActionContainer>
        }
      />
      <Route
        path={`/${entry.id}/schedule`}
        element={
          <NavigationActionContainer>
            <EditSchedule
              journalId={""}
              entryId={entry.id}
              journal={null}
              onCancel={close}
            />
          </NavigationActionContainer>
        }
      />
      <Route
        path={`/${entry.id}/notification-done`}
        element={
          <NavigationActionContainer>
            <NotificationDone entry={entry} journal={null} onSuccess={close} />
          </NavigationActionContainer>
        }
      />
      <Route
        path={`/${entry.id}/move`}
        element={
          <NavigationActionContainer>
            <MoveScrap entry={entry as IScrapEntry} />
          </NavigationActionContainer>
        }
      />
    </Routes>
  );

  function close() {
    navigate("../");
  }
};
