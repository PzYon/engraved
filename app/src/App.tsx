import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { IUser } from "./serverApi/IUser";
import { ReactQueryProviderWrapper } from "./serverApi/reactQuery/ReactQueryProviderWrapper";
import { AppHost } from "./AppHost";
import { PageContextProvider } from "./components/layout/pages/PageContextProvider";
import { DialogContextProvider } from "./components/layout/dialogs/DialogContextProvider";
import { AppContextProvider } from "./AppContextProvider";

import { DisplayModeContextProvider } from "./components/overview/overviewList/DisplayModeContextProvider";
import { ActionContextProvider } from "./components/common/actions/ActionContextProvider";

export const App: React.FC<{ user: IUser }> = ({ user }) => {
  const router = createBrowserRouter([
    {
      path: "/*",
      children: [],
      element: (
        <PageContextProvider>
          <DialogContextProvider>
            <DisplayModeContextProvider>
              <AppHost />
            </DisplayModeContextProvider>
          </DialogContextProvider>
        </PageContextProvider>
      ),
    },
  ]);

  return (
    <AppContextProvider user={user}>
      <ActionContextProvider>
        <ReactQueryProviderWrapper>
          <RouterProvider router={router} />
        </ReactQueryProviderWrapper>
      </ActionContextProvider>
    </AppContextProvider>
  );
};
