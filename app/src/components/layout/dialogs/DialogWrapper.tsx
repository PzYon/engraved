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
import { DeviceWidth, useDeviceWidth } from "../../common/useDeviceWidth";
import { AppContent } from "../AppContent";

const SlideUp = React.forwardRef(function Transition(
  props: { children: React.ReactNode },
  ref,
) {
  return (
    <Slide direction="up" ref={ref} {...props}>
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
  const deviceWidth = useDeviceWidth();

  const RootBodyElement =
    props.fullScreen || deviceWidth === DeviceWidth.Small
      ? AppContent
      : DialogHost;

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
        <StyledDialogContent>{children}</StyledDialogContent>
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

const DialogHost = styled("div")`
  max-width: 100%;
  width: 800px;
`;

const StyledDialogContent = styled(DialogContent)`
  .MuiFormControl-root {
    width: 100%;
    padding-top: 0;
  }
`;
