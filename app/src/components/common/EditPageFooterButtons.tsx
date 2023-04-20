import React from "react";
import { DetailsSection } from "../layout/DetailsSection";
import { FormButtonContainer } from "./FormButtonContainer";
import { Button } from "@mui/material";

export const EditPageFooterButtons: React.FC<{
  onSave: () => void;
  disableSave: boolean;
  onCancel: () => void;
}> = ({ onSave, disableSave, onCancel }) => {
  return (
    <DetailsSection>
      <FormButtonContainer style={{ paddingTop: 0 }}>
        <Button variant="outlined" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="contained" onClick={onSave} disabled={disableSave}>
          Save
        </Button>
      </FormButtonContainer>
    </DetailsSection>
  );
};
