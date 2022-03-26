import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import React from "react";
import { translations } from "../../../i18n/translations";

export const DialogWrapper: React.FC<{
  title: string;
  onClose: () => void;
}> = ({ title, children, onClose }) => {
  return (
    <Dialog
      open={true}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{translations.close}</Button>
      </DialogActions>
    </Dialog>
  );
};
