import React from "react";
import { BrowserRouter } from "react-router-dom";
import { IUser } from "./serverApi/IUser";
import { ReactQueryProviderWrapper } from "./serverApi/reactQuery/ReactQueryProviderWrapper";
import { AppHost } from "./AppHost";
import { PageContextProvider } from "./components/layout/pages/PageContextProvider";
import { DialogContextProvider } from "./components/layout/dialogs/DialogContextProvider";
import { AppContextProvider } from "./AppContextProvider";

export const App: React.FC<{ user: IUser }> = ({ user }) => (
  <AppContextProvider user={user}>
    <ReactQueryProviderWrapper>
      <BrowserRouter>
        <PageContextProvider>
          <DialogContextProvider>
            <AppHost />
          </DialogContextProvider>
        </PageContextProvider>
      </BrowserRouter>
    </ReactQueryProviderWrapper>
  </AppContextProvider>
);
