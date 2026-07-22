import React, { useState } from "react";
import { DialogFormButtonContainer } from "./FormButtonContainer";
import { Button, styled, TextField, Typography } from "@mui/material";

const entityLabels: Record<"journal" | "entry" | "user", string> = {
  journal: "journal",
  entry: "scrap",
  user: "user",
};

export const DeleteButtons: React.FC<{
  onDelete: () => void;
  onCancel: () => void;
  entityType: "journal" | "entry" | "user";
  requiresConfirmation?: boolean;
  confirmationValue?: string;
}> = ({
  onDelete,
  onCancel,
  entityType,
  requiresConfirmation,
  confirmationValue = "delete",
}) => {
  const [isFirstYes, setIsFirstYes] = useState(false);
  const [isSecondYes, setIsSecondYes] = useState(false);

  const handleYesClick = () => {
    if (requiresConfirmation && !isSecondYes) {
      setIsFirstYes(true);
      return;
    }

    onDelete();
  };

  const handleConfirmationChange = (value: string) => {
    setIsSecondYes(
      value.toLowerCase().trim() === confirmationValue.toLowerCase().trim(),
    );
  };

  return (
    <>
      <DialogFormButtonContainer>
        <Button variant="outlined" onClick={onCancel}>
          No
        </Button>
        <Button
          variant="contained"
          disabled={isFirstYes && !isSecondYes}
          onClick={handleYesClick}
        >
          Yes, delete!
        </Button>
      </DialogFormButtonContainer>
      {isFirstYes ? (
        <ExtraContainer>
          <Typography>
            You want to delete a <b>{entityLabels[entityType]}</b>. Just to be
            really sure, please type &quot;{confirmationValue}&quot; to confirm.
          </Typography>
          <TextField
            autoFocus={true}
            onChange={(event) => handleConfirmationChange(event.target.value)}
          />
        </ExtraContainer>
      ) : null}
    </>
  );
};

const ExtraContainer = styled("div")`
  margin-top: 20px;
`;
