import React from "react";
import { IUser } from "./serverApi/IUser";
import { styled } from "@mui/material";
import { AddJournalPage } from "./components/overview/AddJournalPage";
import { JournalPageWrapper } from "./components/details/JournalPageWrapper";
import { JournalsPage } from "./components/overview/journals/JournalsPage";
import { EntriesPage } from "./components/overview/entries/EntriesPage";
import { SearchPage } from "./components/overview/search/SearchPage";
import { ScheduledPage } from "./components/overview/scheduled/ScheduledPage";
import { SettingsPage } from "./pwa/SettingsPage";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { AppContextProvider } from "./AppContextProvider";
import { ActionContextProvider } from "./components/common/actions/ActionContextProvider";
import { ReactQueryProviderWrapper } from "./serverApi/reactQuery/ReactQueryProviderWrapper";
import { PageContextProvider } from "./components/layout/pages/PageContextProvider";
import { DialogContextProvider } from "./components/layout/dialogs/DialogContextProvider";
import { DisplayModeContextProvider } from "./components/overview/overviewList/DisplayModeContextProvider";
import { AppHeader } from "./components/layout/AppHeader";
import { AppAlertBar } from "./components/errorHandling/AppAlertBar";
import { AppContent } from "./components/layout/AppContent";
import { AppErrorBoundary } from "./components/errorHandling/AppErrorBoundary";
import { AppFooter } from "./components/layout/AppFooter";
import {
  JournalDetailsEdit,
  JournalDetailsView,
} from "./components/details/JournalDetails";
import { TagsPage } from "./components/overview/tags/TagsPage";
import { TagPage } from "./components/overview/tags/TagPage";
import { GoToPage } from "./components/overview/goto/GoToPage";
import { QuickAddPage } from "./components/details/scraps/QuickAddPage";
import { FloatingHistoryNavigation } from "./components/layout/FloatingHistoryNavigation";

const router = createBrowserRouter([
  {
    path: "*",
    Component: () => (
      <ActionContextProvider>
        <ReactQueryProviderWrapper>
          <PageContextProvider>
            <DialogContextProvider>
              <DisplayModeContextProvider>
                <Host>
                  <AppHeader />
                  <AppAlertBar />
                  <AppContent scope="body">
                    <AppErrorBoundary>
                      <Outlet />
                    </AppErrorBoundary>
                  </AppContent>
                  <FloatingHistoryNavigation />
                  <AppFooter />
                </Host>
              </DisplayModeContextProvider>
            </DialogContextProvider>
          </PageContextProvider>
        </ReactQueryProviderWrapper>
      </ActionContextProvider>
    ),
    children: [
      {
        path: "journals/create",
        element: <AddJournalPage />,
      },
      {
        path: "journals/details/:journalId/*",
        element: <JournalPageWrapper />,
        children: [
          {
            path: "edit",
            element: <JournalDetailsEdit />,
          },
          {
            path: "*",
            element: <JournalDetailsView />,
          },
        ],
      },
      {
        path: "entries/*",
        element: <EntriesPage />,
      },
      {
        path: "search/*",
        element: <SearchPage />,
      },
      {
        path: "go-to/*",
        element: <GoToPage />,
      },
      {
        path: "quick-add/*",
        element: <QuickAddPage />,
      },
      {
        path: "scheduled/*",
        element: <ScheduledPage />,
      },
      {
        path: "tags/",
        element: <TagsPage />,
      },
      {
        path: "tags/:tagId",
        element: <TagPage />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
      {
        path: "*",
        element: <JournalsPage />,
      },
    ],
  },
]);

export const App: React.FC<{ user: IUser }> = ({ user }) => (
  <AppContextProvider user={user}>
    <RouterProvider router={router} />
  </AppContextProvider>
);

const Host = styled("div")`
  height: 100vh;
  display: flex;
  flex-direction: column;
`;
