import { DeleteEntryAction } from "../../details/edit/DeleteEntryAction";
import { EditScheduleAction } from "../../details/edit/EditScheduleAction";
import { NotificationDoneAction } from "../../details/NotificationDoneAction";
import { MoveScrapAction } from "../../details/scraps/MoveScrapAction";
import { IScrapEntry } from "../../../serverApi/IScrapEntry";
import { NavigationActionContainer } from "./Entry";
import { Route, Routes, useBlocker } from "react-router-dom";
import { IEntry } from "../../../serverApi/IEntry";
import React, { useEffect } from "react";
import { UpsertEntryActionLoader } from "../../details/add/UpsertEntryActionLoader";
import { useScrapContext } from "../../details/scraps/ScrapContext";
import { Button, Typography } from "@mui/material";
import { DialogFormButtonContainer } from "../FormButtonContainer";
import { useDialogContext } from "../../layout/dialogs/DialogContext";

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
            <EditScheduleAction
              journalId={""}
              entryId={entry.id}
              journal={null}
            />
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
          (entry as IScrapEntry).scrapType ? (
            <EditScrapLauncher />
          ) : (
            <NavigationActionContainer shrinkWidthIfPossible={true}>
              <UpsertEntryActionLoader entry={entry} />
            </NavigationActionContainer>
          )
        }
      />
    </Routes>
  );
};

const EditScrapLauncher: React.FC = () => {
  const { renderDialog } = useDialogContext();

  const { isEditMode, setIsEditMode, isDirty } = useScrapContext();

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isEditMode &&
      isDirty &&
      currentLocation.pathname !== nextLocation.pathname,
  );

  useEffect(() => {
    setIsEditMode(!isEditMode);
    return () => {
      setIsEditMode(isEditMode);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (blocker.state !== "blocked") {
      return;
    }

    renderDialog({
      title: "Are you sure?",
      render: (closeDialog) => {
        return (
          <>
            <Typography>
              Do you really want to cancel editing without saving? All changes
              will be lost.
            </Typography>

            <DialogFormButtonContainer>
              <Button variant={"contained"} onClick={closeDialog}>
                Not yet.
              </Button>
              <Button
                variant={"outlined"}
                onClick={() => {
                  closeDialog();
                  blocker.proceed();
                }}
              >
                Yeah, I&apos;m done.
              </Button>
            </DialogFormButtonContainer>
          </>
        );
      },
    });
  }, [blocker, renderDialog]);

  return null;
};
