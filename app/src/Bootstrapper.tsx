import React, { useEffect, useRef, useState } from "react";
import { App } from "./App";
import { ServerApi } from "./serverApi/ServerApi";
import { IAuthResult } from "./serverApi/IAuthResult";
import { IUser } from "./serverApi/IUser";
import { GoogleInitializeResponse } from "./serverApi/authentication/google/GoogleTypes";
import { registerGooglePrompt } from "./serverApi/authentication/google/registerGooglePrompt";
import { AuthStorage } from "./serverApi/authentication/AuthStorage";
import { ApiError } from "./serverApi/ApiError";
import { CircularProgress, styled, Typography } from "@mui/material";

const storage = new AuthStorage();

export const Bootstrapper: React.FC = () => {
  const [user, setUser] = useState<IUser>();
  const ref = useRef<HTMLDivElement>();

  const [isLoading, setIsLoading] = useState(false);
  const [isNotVisible, setIsNotVisible] = useState(true);

  useEffect(() => {
    ServerApi.authenticateForTests("");
  }, []);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    if (!storage.hasResult()) {
      setIsNotVisible(false);
      registerGooglePrompt(onSignedIn, ref.current);
      return;
    }

    ServerApi.tryAuthenticate(storage.getAuthResult().jwtToken)
      .then((u) => {
        setUser(u);
        registerGooglePrompt(onSignedIn, ref.current, true);
      })
      .catch((e: ApiError) => {
        if (e.status === 401) {
          registerGooglePrompt(onSignedIn, ref.current);
        }
      })
      .finally(() => setIsNotVisible(false));
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
            variant={"h1"}
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

  function onSignedIn(response: GoogleInitializeResponse) {
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
