import { useDialogContext } from "../../layout/dialogs/DialogContext";
import { useScrapContext } from "../../details/scraps/ScrapContext";
import { DialogFormButtonContainer } from "../FormButtonContainer";
import { useBlocker } from "react-router-dom";
import { useEffect } from "react";
import { Button, Typography } from "@mui/material";

export const EditScrapLauncher: React.FC = () => {
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
