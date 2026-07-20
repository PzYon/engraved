import React, { useEffect } from "react";
import { IUser } from "./serverApi/IUser";
import { styled } from "@mui/material";
import { AddJournalPage } from "./components/overview/AddJournalPage";
import { JournalPageWrapper } from "./components/details/JournalPageWrapper";
import { JournalsPage } from "./components/overview/journals/JournalsPage";
import { EntriesPage } from "./components/overview/entries/EntriesPage";
import { SearchPage } from "./components/overview/search/SearchPage";
import { ScheduledPage } from "./components/overview/scheduled/ScheduledPage";
import { SettingsPage } from "./pwa/SettingsPage";
import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from "@tanstack/react-router";
import { AppContextProvider } from "./AppContextProvider";
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
import { LazyLoadSuspender } from "./components/common/LazyLoadSuspender";
import { validateAppSearch } from "./components/common/actions/searchParamHooks";
import { AdminPage } from "./components/admin/AdminPage";

// Defined before RootLayout so the component reference is available
const Host = styled("div")`
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const RootLayout: React.FC = () => (
  <ReactQueryProviderWrapper>
    <PageContextProvider>
      <DialogContextProvider>
        <DisplayModeContextProvider>
          <Host>
            <AppHeader />
            <AppAlertBar />
            <AppContent scope="body">
              <AppErrorBoundary>
                <LazyLoadSuspender>
                  <Outlet />
                </LazyLoadSuspender>
              </AppErrorBoundary>
            </AppContent>
            <FloatingHistoryNavigation />
            <AppFooter />
          </Host>
        </DisplayModeContextProvider>
      </DialogContextProvider>
    </PageContextProvider>
  </ReactQueryProviderWrapper>
);

// Root route — shared layout for all pages. The search schema (typed, with
// arbitrary string params passed through) lives in searchParamHooks.
const rootRoute = createRootRoute({
  component: RootLayout,
  notFoundComponent: () => <JournalsPage />,
  validateSearch: validateAppSearch,
});

const journalsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: JournalsPage,
});

const journalsCreateRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/journals/create",
  component: AddJournalPage,
});

const journalDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/journals/details/$journalId",
  component: JournalPageWrapper,
});

const journalDetailsViewRoute = createRoute({
  getParentRoute: () => journalDetailsRoute,
  path: "/",
  component: JournalDetailsView,
});

const journalDetailsEditRoute = createRoute({
  getParentRoute: () => journalDetailsRoute,
  path: "/edit",
  component: JournalDetailsEdit,
});

const entriesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/entries",
  component: EntriesPage,
});

const searchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/search",
  component: SearchPage,
});

const goToRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/go-to",
  component: GoToPage,
});

const quickAddRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/quick-add",
  component: QuickAddPage,
});

const scheduledRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/scheduled",
  component: ScheduledPage,
});

const tagsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/tags",
  component: TagsPage,
});

const tagRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/tags/$tagId",
  component: TagPage,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings",
  component: SettingsPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
});

const routeTree = rootRoute.addChildren([
  journalsRoute,
  journalsCreateRoute,
  journalDetailsRoute.addChildren([
    journalDetailsViewRoute,
    journalDetailsEditRoute,
  ]),
  entriesRoute,
  searchRoute,
  goToRoute,
  quickAddRoute,
  scheduledRoute,
  tagsRoute,
  tagRoute,
  settingsRoute,
  adminRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export const App: React.FC<{ user: IUser }> = ({ user }) => {
  useEffect(() => {
    import("./components/details/scraps/markdown/LazyMarkdown");
  }, []);

  return (
    <AppContextProvider user={user}>
      <RouterProvider router={router} />
    </AppContextProvider>
  );
};
