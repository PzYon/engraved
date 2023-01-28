import React, { useEffect, useRef, useState } from "react";
import { App } from "./App";
import { ServerApi } from "./serverApi/ServerApi";
import { IAuthResult } from "./serverApi/IAuthResult";
import { IUser } from "./serverApi/IUser";
import { GoogleInitializeResponse } from "./serverApi/authentication/google/GoogleTypes";
import { renderGoogleSignInButton } from "./serverApi/authentication/google/renderGoogleSignInButton";
import { AuthStorage } from "./serverApi/authentication/AuthStorage";
import { ApiError } from "./serverApi/ApiError";
import { CircularProgress, styled } from "@mui/material";

export const Bootstrapper: React.FC = () => {
  const [user, setUser] = useState<IUser>();
  const ref = useRef<HTMLDivElement>();

  const [isLoading, setIsLoading] = useState(false);
  const [isNotVisible, setIsNotVisible] = useState(true);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const storage = new AuthStorage();

    if (!storage.hasResult()) {
      setIsNotVisible(false);
      renderGoogleSignInButton(onSignedIn, ref.current);
      return;
    }

    ServerApi.tryAuthenticate(storage.getAuthResult().jwtToken)
      .then(setUser)
      .catch((e: ApiError) => {
        if (e.status === 401) {
          renderGoogleSignInButton(onSignedIn, ref.current);
        }
      })
      .finally(() => setIsNotVisible(false));
  }, [ref.current]);

  if (user) {
    return <App user={user} />;
  }

  return (
    <Host isNotVisible={isNotVisible}>
      {isLoading ? (
        <CircularProgress sx={{ color: "common.white" }} />
      ) : (
        <WelcomeContainer>
          <WelcomeText>metrix.</WelcomeText>
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
  background: linear-gradient(
    146deg,
    ${(p) => p.theme.palette.text.primary} 0%,
    ${(p) => p.theme.palette.primary.main} 100%
  );
  visibility: ${(p) => (p.isNotVisible ? "hidden" : "visible")};
`;

const WelcomeContainer = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const WelcomeText = styled("div")`
  font-family: Chewy, serif;
  color: ${(p) => p.theme.palette.common.white};
  font-size: 90px;
  margin-bottom: 30px;
`;
