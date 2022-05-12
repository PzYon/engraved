import React, { useState } from "react";
import { GoogleLoginResponse, useGoogleLogin } from "react-google-login";
import { App } from "./App";
import { ServerApi } from "./serverApi/ServerApi";
import { envSettings } from "./env/envSettings";

export const UnauthenticatedApp: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const { signIn } = useGoogleLogin({
    redirectUri: envSettings.auth.google.redirectUri,
    clientId: envSettings.auth.google.clientId,
    uxMode: "popup",
    onSuccess: (response) => {
      debugger;
      const accessToken = (response as GoogleLoginResponse).tokenObj.id_token;
      ServerApi.setToken(accessToken);
      setIsAuthenticated(true);
    },
    onFailure: (error) => {
      alert("Auth error, see console for details");
      console.log("Auth error", error);
    },
  });

  if (isAuthenticated) {
    return <App />;
  }

  return <button onClick={signIn}>Sign-in with Google</button>;
};
