import React, { useState } from "react";
import GoogleLogin, { GoogleLoginResponse } from "react-google-login";
import { App } from "./App";
import { ServerApi } from "./serverApi/ServerApi";
import { envSettings } from "./env/envSettings";
import styled from "styled-components";

export const UnauthenticatedApp: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (isAuthenticated) {
    return <App />;
  }

  return (
    <Host>
      <GoogleLogin
        clientId={envSettings.auth.google.clientId}
        redirectUri={envSettings.auth.google.redirectUri}
        buttonText="Login with Google"
        onSuccess={(response) => {
          signInWithJwt(response as GoogleLoginResponse);
        }}
        onFailure={(error) => {
          alert("Auth error, see console for details");
          console.log("Auth error", error);
        }}
        cookiePolicy={"single_host_origin"}
      />{" "}
    </Host>
  );

  function signInWithJwt(response: GoogleLoginResponse) {
    const idToken = response.tokenObj.id_token;

    ServerApi.authenticate(idToken).then(() => {
      setIsAuthenticated(true);
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
