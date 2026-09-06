import React, { useEffect, useRef, useState } from "react";
import { styled } from "@mui/material";
import { ServerApi } from "../ServerApi";
import { renderGoogleSignInButton } from "./registerGooglePrompt";
import { FadeInContainer } from "../../components/common/FadeInContainer";

const keyForSessionExpiryHandler = "session-expired-indicator";

// Sits in the app header next to the other global indicators and only shows up
// when the session could not be renewed on its own and Google's silent One Tap
// prompt did not appear either. Google's own button is used on purpose: a
// button the user clicks always opens the sign-in flow, whereas the silent
// prompt may be suppressed by the browser without telling us (issue #3009).
export const SessionExpiredIndicator: React.FC = () => {
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
    if (!buttonHostRef.current) {
      return;
    }

    // The icon variant keeps the button to the same size as the neighbouring
    // header icons.
    renderGoogleSignInButton(buttonHostRef.current, {
      type: "icon",
      shape: "circle",
      theme: "outline",
      size: "large",
    });
  }, [isExpired]);

  if (!isExpired) {
    return null;
  }

  return (
    <FadeInContainer doPulsate={true} testId="session-expired-indicator">
      <ButtonHost
        ref={buttonHostRef}
        title="Your session has expired. Please sign in again to continue."
      />
    </FadeInContainer>
  );
};

const ButtonHost = styled("div")`
  display: flex;
  align-items: center;
`;
