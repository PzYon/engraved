import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AppContextProvider } from "./AppContext";
import { DialogContextProvider } from "./components/layout/dialogs/DialogContext";
import { IUser } from "./serverApi/IUser";
import { PageContextProvider } from "./components/layout/pages/PageContext";
import { ReactQueryProviderWrapper } from "./serverApi/reactQuery/ReactQueryProviderWrapper";
import { AppHost } from "./AppHost";

export const App: React.FC<{ user: IUser }> = ({ user }) => (
  <AppContextProvider user={user}>
    <ReactQueryProviderWrapper>
      <BrowserRouter>
        <DialogContextProvider>
          <PageContextProvider>
            <AppHost />
          </PageContextProvider>
        </DialogContextProvider>
      </BrowserRouter>
    </ReactQueryProviderWrapper>
  </AppContextProvider>
);
