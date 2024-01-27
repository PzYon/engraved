import React from "react";
import { PageSection } from "../layout/pages/PageSection";
import { PageFormButtonContainer } from "./FormButtonContainer";
import { Button } from "@mui/material";

export const EditPageFooterButtons: React.FC<{
  onSave: () => void;
  disableSave?: boolean;
  onCancel: () => void;
}> = ({ onSave, disableSave, onCancel }) => {
  return (
    <PageSection>
      <PageFormButtonContainer style={{ paddingTop: 0 }}>
        <Button variant="outlined" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="contained" onClick={onSave} disabled={disableSave}>
          Save
        </Button>
      </PageFormButtonContainer>
    </PageSection>
  );
};
