import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
} from "@mui/material";
import React from "react";
import { translations } from "../../../i18n/translations";
import { DialogProps } from "@mui/material/Dialog/Dialog";
import { AppContent } from "../AppContent";

const SlideUp = React.forwardRef(function Transition(props, ref) {
  return (
    <Slide direction="up" ref={ref} {...props}>
      {/* eslint-disable-next-line react/prop-types */}
      {props.children as never}
    </Slide>
  );
});

export const DialogWrapper: React.FC<{
  title: string;
  onClose: () => void;
  props: Partial<DialogProps>;
}> = ({ title, onClose, props, children }) => {
  // eslint-disable-next-line react/prop-types
  const RootBodyElement = props.fullScreen ? AppContent : React.Fragment;

  return (
    <Dialog
      {...props}
      open={true}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      TransitionComponent={SlideUp as never}
    >
      <RootBodyElement>
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>{children}</DialogContent>
        <DialogActions>
          <Button onClick={onClose}>{translations.close}</Button>
        </DialogActions>
      </RootBodyElement>
    </Dialog>
  );
};
