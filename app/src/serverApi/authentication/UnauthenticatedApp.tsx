import React, { useEffect, useRef, useState } from "react";
import { App } from "../../App";
import { ServerApi } from "../ServerApi";
import styled from "styled-components";
import { IAuthResult } from "../IAuthResult";
import { IUser } from "../IUser";
import { GoogleInitializeResponse } from "./google/GoogleTypes";
import { signInWithGoogle } from "./google/signInWithGoogle";

export const UnauthenticatedApp: React.FC = () => {
  const [user, setUser] = useState<IUser>();
  const ref = useRef<HTMLDivElement>();

  useEffect(() => {
    return signInWithGoogle(signInWithJwt, ref.current);
  }, [ref]);

  if (user) {
    return <App user={user} />;
  }

  return (
    <Host>
      <div ref={ref} />
    </Host>
  );

  function signInWithJwt(response: GoogleInitializeResponse) {
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
