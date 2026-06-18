import React, { useEffect, useRef, useState } from "react";
import { App } from "./App";
import { ServerApi } from "./serverApi/ServerApi";
import { IAuthResult } from "./serverApi/IAuthResult";
import { IUser } from "./serverApi/IUser";
import { registerGooglePrompt } from "./serverApi/authentication/registerGooglePrompt";
import { CircularProgress, styled, Typography } from "@mui/material";
import { knownQueryParams } from "./components/common/actions/searchParamHooks";
import { CredentialResponse } from "google-one-tap";

export const Bootstrapper: React.FC = () => {
  const isInitialized = useRef(false);

  const [user, setUser] = useState<IUser>();
  const ref = useRef<HTMLDivElement | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isNotVisible, setIsNotVisible] = useState(true);

  useEffect(() => {
    if (isInitialized.current) {
      return;
    }

    isInitialized.current = true;

    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has(knownQueryParams.testUser)) {
      ServerApi.setUpForTests(searchParams.get(knownQueryParams.testUser)!)
        .then((r) => {
          setUser(r.user);
        })
        .finally(() => setIsNotVisible(false));
      return;
    }

    if (!ref.current) {
      return;
    }

    // In test mode the token is persisted, so restore the session on reloads
    // (e.g. when a test navigates directly via page.goto) instead of going
    // through Google, which is not available in the e2e environment.
    if (ServerApi.isTestMode()) {
      ServerApi.restoreTestSession()
        .then((u) => setUser(u))
        .finally(() => setIsNotVisible(false));
      return;
    }

    // Clean up the token that earlier versions persisted here.
    localStorage.removeItem("engraved::auth");

    // The token is no longer persisted, so we always (re-)authenticate via
    // Google. One Tap signs the user in silently when possible and otherwise
    // renders the sign-in button.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsNotVisible(false);
    registerGooglePrompt(onSignedIn, ref.current);
  }, []);

  if (user) {
    return <App user={user} />;
  }

  return (
    <Host isNotVisible={isNotVisible}>
      {isLoading ? (
        <CircularProgress sx={{ color: "common.white" }} />
      ) : (
        <WelcomeContainer>
          <Typography
            variant="h1"
            sx={{
              color: "common.black",
              fontSize: "90px",
              pb: 2,
              mb: 4,
            }}
          >
            engraved.
          </Typography>
          <div ref={ref} />
        </WelcomeContainer>
      )}
    </Host>
  );

  function onSignedIn(response: CredentialResponse) {
    setIsLoading(true);

    ServerApi.authenticate(response.credential)
      .then((authResult: IAuthResult) => {
        setUser(authResult.user);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }
};

const Host = styled("div")<{ isNotVisible: boolean }>`
  display: flex;
  height: 100vh;
  width: 100%;
  justify-content: center;
  align-items: center;

  visibility: ${(p) => (p.isNotVisible ? "hidden" : "visible")};

  // https://www.eggradients.com/gradient/marley
  background-color: #118ab2;
  background-image: linear-gradient(
    319deg,
    #118ab2 0%,
    #06d6a0 37%,
    #ffd166 100%
  );
`;

const WelcomeContainer = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
