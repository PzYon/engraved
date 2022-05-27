import React, { useEffect, useState } from "react";
import { App } from "./App";
import { ServerApi } from "./serverApi/ServerApi";
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
      <div>not impl. yet</div>
    </Host>
  );

  function signInWithJwt() {
    const idToken = ""; // response.tokenObj.id_token;

    ServerApi.authenticate(idToken).then((authResult: IAuthResult) => {
      setUser(authResult.user);
    });
  }

  function GoogleAuth() {
    useEffect(() => {
      const src = "https://accounts.google.com/gsi/client";

      new Promise<void>((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => resolve();
        script.onerror = (err) => reject(err);
        document.body.appendChild(script);
      })
        .then((a) => {
          debugger;
          // console.log(google)
          // google.accounts.id.initialize({
          //   client_id: "<don't worry, I put the ID here>",
          //   callback: handleCredentialResponse,
          // })
          // google.accounts.id.renderButton(
          //   googleButton.current, //this is a ref hook to the div in the official example
          //   { theme: 'outline', size: 'large' } // customization attributes
          // )
        })
        .catch(console.error);

      return () => {
        const scriptTag = document.querySelector(`script[src="${src}"]`);
        if (scriptTag) document.body.removeChild(scriptTag);
      };
    }, []);
  }
};

const Host = styled.div`
  display: flex;
  height: 100vh;
  width: 100%;
  justify-content: center;
  align-items: center;
`;
