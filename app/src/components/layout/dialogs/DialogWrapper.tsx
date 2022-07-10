import { Close } from "@mui/icons-material";
import {
  Dialog,
  DialogContent,
  DialogProps,
  DialogTitle,
  IconButton,
  Slide,
  styled,
} from "@mui/material";
import React from "react";
import { AppContent } from "../AppContent";

const SlideUp = React.forwardRef(function Transition(
  props: { children: React.ReactNode },
  ref
) {
  return (
    <Slide direction="up" ref={ref} {...props}>
      {/* eslint-disable-next-line react/prop-types */}
      {props.children as never}
    </Slide>
  );
});

export const DialogWrapper: React.FC<{
  children: React.ReactNode;
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
      TransitionComponent={SlideUp as never}
    >
      <RootBodyElement>
        <Header>
          <StyledDialogTitle>{title}</StyledDialogTitle>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{ color: (theme) => theme.palette.grey[500] }}
          >
            <Close />
          </IconButton>
        </Header>
        <DialogContent sx={{ paddingTop: 0 }}>{children}</DialogContent>
      </RootBodyElement>
    </Dialog>
  );
};

const Header = styled("div")`
  display: flex;
  flex-direction: row;
  width: 100%;
`;

const StyledDialogTitle = styled(DialogTitle)`
  flex-grow: 1;
`;
