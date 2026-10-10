import React from "react";
import {
  Button,
  styled,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { IScratchpad } from "../../serverApi/IScratchpad";
import { translations } from "../../i18n/translations";

// Cannot be dismissed: whichever version is not picked is gone, so the user has
// to choose.
export const ScratchpadConflictDialog: React.FC<{
  conflict: IScratchpad | undefined;
  keepMine: () => void;
  takeTheirs: () => void;
}> = ({ conflict, keepMine, takeTheirs }) => (
  <Dialog open={!!conflict}>
    <DialogTitle>{translations.scratchpad_conflict_title}</DialogTitle>
    <DialogContent>
      <DialogContentText>
        {translations.scratchpad_conflict_question}
      </DialogContentText>
      <OtherVersion>{conflict?.content}</OtherVersion>
    </DialogContent>
    <DialogActions>
      <Button variant="outlined" onClick={takeTheirs}>
        {translations.scratchpad_conflict_takeTheirs}
      </Button>
      <Button variant="contained" onClick={keepMine}>
        {translations.scratchpad_conflict_keepMine}
      </Button>
    </DialogActions>
  </Dialog>
);

const OtherVersion = styled("pre")`
  max-height: 200px;
  overflow: auto;
  white-space: pre-wrap;
  font-family: ${(p) => p.theme.typography.fontFamily};
  padding: ${(p) => p.theme.spacing(1)};
  background-color: ${(p) => p.theme.palette.background.default};
`;
