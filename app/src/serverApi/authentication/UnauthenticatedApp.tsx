import React, { useEffect, useRef, useState } from "react";
import { App } from "../../App";
import { ServerApi } from "../ServerApi";
import styled from "styled-components";
import { IAuthResult } from "../IAuthResult";
import { IUser } from "../IUser";
import { GoogleInitializeResponse } from "./google/GoogleTypes";
import { renderGoogleSignInButton } from "./google/renderGoogleSignInButton";
import { AuthStorage } from "./AuthStorage";
import { ApiError } from "../ApiError";

export const UnauthenticatedApp: React.FC = () => {
  const [user, setUser] = useState<IUser>();
  const ref = useRef<HTMLDivElement>();

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    wakeUpApi();

    const storage = new AuthStorage();
    if (!storage.hasResult()) {
      return renderGoogleSignInButton(onSignedIn, ref.current);
    }

    ServerApi.tryAuthenticate(storage.getAuthResult().jwtToken)
      .then((u) => {
        setUser(u);
      })
      .catch((e: ApiError) => {
        if (e.status === 401) {
          renderGoogleSignInButton(onSignedIn, ref.current);
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

function wakeUpApi() {
  const start = performance.now();
  ServerApi.wakeMeUp().then(() => {
    const end = performance.now();
    console.log(`API has woken up after ${Math.round(end - start)}ms`);
  });
}

const Host = styled.div`
  display: flex;
  height: 100vh;
  width: 100%;
  justify-content: center;
  align-items: center;
`;
