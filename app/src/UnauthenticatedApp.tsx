import React, { useState } from "react";
import GoogleLogin, { GoogleLoginResponse } from "react-google-login";
import { App } from "./App";
import { ServerApi } from "./serverApi/ServerApi";
import { envSettings } from "./env/envSettings";
import styled from "styled-components";
import { IAuthResult } from "./serverApi/IAuthResult";
import { IUser } from "./serverApi/IUser";

export const UnauthenticatedApp: React.FC = () => {
  const [user, setUser] = useState<IUser>();

  if (user) {
    return <App user={user} />;
  }

  return (
    <Host>
      <GoogleLogin
        clientId={envSettings.auth.google.clientId}
        redirectUri={envSettings.auth.google.redirectUri}
        buttonText="Login with Google"
        cookiePolicy={"single_host_origin"}
        uxMode="popup"
        onSuccess={(response) => {
          signInWithJwt(response as GoogleLoginResponse);
        }}
        onFailure={(error) => {
          alert("Auth error, see console for details");
          console.log("Auth error", error);
        }}
      />{" "}
    </Host>
  );

  function signInWithJwt(response: GoogleLoginResponse) {
    const idToken = response.tokenObj.id_token;

    ServerApi.authenticate(idToken).then((authResult: IAuthResult) => {
      setUser(authResult.user);
    });
  }
};

const Host = styled.div`
  display: flex;
  height: 100vh;
  width: 100%;
  justify-content: center;
  align-items: center;
`;
