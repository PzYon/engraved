import React, { useEffect, useRef, useState } from "react";
import { App } from "../../App";
import { ServerApi } from "../ServerApi";
import styled from "styled-components";
import { IAuthResult } from "../IAuthResult";
import { IUser } from "../IUser";
import { GoogleInitializeResponse } from "./google/GoogleTypes";
import { signInWithGoogle } from "./google/signInWithGoogle";
import { AuthTokenStorage } from "./AuthTokenStorage";
import { ApiError } from "../ApiError";

export const UnauthenticatedApp: React.FC = () => {
  const [user, setUser] = useState<IUser>();
  const ref = useRef<HTMLDivElement>();

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const storage = new AuthTokenStorage();
    if (!storage.hasResult()) {
      return signInWithGoogle(onSignedIn, ref.current);
    }

    ServerApi.tryAuthenticate(storage.getAuthResult().jwtToken)
      .then((u) => {
        setUser(u);
      })
      .catch((e: ApiError) => {
        if (e.status === 401) {
          signInWithGoogle(onSignedIn, ref.current);
        }
      });
  }, []);

  if (user) {
    return <App user={user} />;
  }

  return (
    <Host>
      <div ref={ref} />
    </Host>
  );

  function onSignedIn(response: GoogleInitializeResponse) {
    ServerApi.authenticate(response.credential).then(
      (authResult: IAuthResult) => {
        setUser(authResult.user);
      }
    );
  }
};

const Host = styled.div`
  display: flex;
  height: 100vh;
  width: 100%;
  justify-content: center;
  align-items: center;
`;
