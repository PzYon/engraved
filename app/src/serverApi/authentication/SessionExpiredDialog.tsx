import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  styled,
  Typography,
} from "@mui/material";
import { ServerApi } from "../ServerApi";
import { renderGoogleSignInButton } from "./registerGooglePrompt";

const keyForSessionExpiryHandler = "session-expired-dialog";

// Shown when the session could not be renewed on its own and Google's silent
// One Tap prompt did not appear either. Passing no onClose keeps the dialog
// non-dismissible: without signing in again there is nothing the user can do in
// the app anyway, and the requests that ran into the expired token are waiting
// for this sign-in.
export const SessionExpiredDialog: React.FC = () => {
  const [isExpired, setIsExpired] = useState(false);
  const buttonHostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    ServerApi.sessionExpiryHandler.registerHandler(
      keyForSessionExpiryHandler,
      setIsExpired,
    );

    return () =>
      ServerApi.sessionExpiryHandler.unregisterHandler(
        keyForSessionExpiryHandler,
      );
  }, []);

  useEffect(() => {
    if (isExpired && buttonHostRef.current) {
      renderGoogleSignInButton(buttonHostRef.current);
    }
  }, [isExpired]);

  return (
    <Dialog open={isExpired}>
      <DialogTitle>Your session has expired</DialogTitle>
      <DialogContent>
        <Typography sx={{ pb: 2 }}>
          Please sign in again to continue. Your pending changes will be sent as
          soon as you are back in.
        </Typography>
        <ButtonHost ref={buttonHostRef} />
      </DialogContent>
    </Dialog>
  );
};

const ButtonHost = styled("div")`
  display: flex;
  justify-content: center;
  padding-bottom: 8px;
`;
