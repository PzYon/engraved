import React, { useEffect, useRef, useState } from "react";
import { App } from "./App";
import { ServerApi } from "./serverApi/ServerApi";
import styled from "styled-components";
import { IAuthResult } from "./serverApi/IAuthResult";
import { IUser } from "./serverApi/IUser";
import { envSettings } from "./env/envSettings";

export const UnauthenticatedApp: React.FC = () => {
  const [user, setUser] = useState<IUser>();

  const ref = useRef();

  useEffect(() => {
    const src = "https://accounts.google.com/gsi/client";

    new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve();
      script.onerror = (err) => reject(err);
      document.body.appendChild(script);
    })
      .then(() => {
        debugger;

        google.accounts.id.initialize({
          client_id: envSettings.auth.google.clientId,
          callback: signInWithJwt,
        });

        google.accounts.id.renderButton(
          ref.current, //this is a ref hook to the div in the official example
          { theme: "outline", size: "large" } // customization attributes
        );
      })
      .catch(console.error);

    return () => {
      const scriptTag = document.querySelector(`script[src="${src}"]`);
      if (scriptTag) document.body.removeChild(scriptTag);
    };
  }, []);

  if (user) {
    return <App user={user} />;
  }

  return (
    <Host>
      <div ref={ref}>not impl. yet</div>
    </Host>
  );

  function signInWithJwt() {
    debugger;

    const idToken = ""; // response.tokenObj.id_token;

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
