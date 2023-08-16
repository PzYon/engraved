import React, { useState } from "react";
import { DialogFormButtonContainer } from "./FormButtonContainer";
import { Button, styled, TextField, Typography } from "@mui/material";

export const DeleteButtons: React.FC<{
  onDelete: () => void;
  onCancel: () => void;
  entityType: "metric" | "measurement";
  requiresConfirmation: boolean;
}> = ({ onDelete, onCancel, entityType, requiresConfirmation }) => {
  const [isFirstYes, setIsFirstYes] = useState(false);
  const [isSecondYes, setIsSecondYes] = useState(false);

  return (
    <>
      <DialogFormButtonContainer>
        <Button
          variant={!isSecondYes ? "contained" : "outlined"}
          onClick={onCancel}
        >
          No
        </Button>
        <Button
          variant={isSecondYes ? "contained" : "outlined"}
          disabled={isFirstYes && !isSecondYes}
          onClick={() => {
            if (requiresConfirmation && !isSecondYes) {
              setIsFirstYes(true);
            } else {
              onDelete();
            }
          }}
        >
          Yes, delete!
        </Button>
      </DialogFormButtonContainer>
      {isFirstYes ? (
        <ExtraContainer>
          <Typography>
            You want to delete a{" "}
            <b>{entityType === "metric" ? "metric" : "scrap"}</b>. Just to be
            really sure, please type &quot;delete&quot; to confirm.
          </Typography>
          <TextField
            autoFocus={true}
            onChange={(event) => {
              setIsSecondYes(
                event.target.value?.toLowerCase().trim() === "delete"
              );
            }}
          />
        </ExtraContainer>
      ) : null}
    </>
  );
};

const ExtraContainer = styled("div")`
  margin-top: 20px;
`;
