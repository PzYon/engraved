import React, { useState } from "react";
import { DialogFormButtonContainer } from "./FormButtonContainer";
import { Button, styled, TextField, Typography } from "@mui/material";

export const DeleteButtons: React.FC<{
  onDelete: () => void;
  onCancel: () => void;
  requiresConfirmation: boolean;
}> = ({ onDelete, onCancel, requiresConfirmation }) => {
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
            Just to be really sure, please type &quot;delete&quot; to confirm.
          </Typography>
          <TextField
            autoFocus={true}
            onChange={(event) => {
              setIsSecondYes(event.target.value === "delete");
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
