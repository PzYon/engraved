import React, { useState } from "react";
import { DialogFormButtonContainer } from "./FormButtonContainer";
import { Button, styled, TextField, Typography } from "@mui/material";

export const SafeDeleteButton: React.FC<{
  onDelete: () => void;
  onCancel: () => void;
}> = ({ onDelete, onCancel }) => {
  const [isYes, setIsYes] = useState(false);
  const [showFinalYes, setShowFinalYes] = useState(false);

  return (
    <>
      <DialogFormButtonContainer>
        <Button
          variant={!showFinalYes ? "contained" : "outlined"}
          onClick={onCancel}
        >
          No
        </Button>
        <Button
          variant={showFinalYes ? "contained" : "outlined"}
          color="primary"
          disabled={isYes && !showFinalYes}
          onClick={() => {
            if (!isYes) {
              setIsYes(true);
            } else {
              onDelete();
            }
          }}
        >
          Yes, delete!
        </Button>
      </DialogFormButtonContainer>
      {isYes ? (
        <ExtraContainer>
          <Typography>
            Just to be really sure, please type &quot;yes&quot; to confirm.
          </Typography>
          <TextField
            onChange={(event) => {
              setShowFinalYes(event.target.value === "yes");
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
