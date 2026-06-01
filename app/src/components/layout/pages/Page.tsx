import React, { memo, useEffect } from "react";
import { FilterMode, usePageContext } from "./PageContext";
import { FadeInContainer } from "../../common/FadeInContainer";
import { IAction } from "../../common/actions/IAction";
import { IPageTab } from "../tabs/IPageTab";
import { useNavigate, useRouterState } from "@tanstack/react-router";

// TanStack Router's search type inference requires a specific route context.
// Page is route-agnostic, so we express the contract through a typed shim.
type SearchOnlyNavigate = (opts: {
  search?: () => Record<string, string>;
  replace?: boolean;
}) => void;

export const Page: React.FC<{
  children: React.ReactNode;
  actions?: IAction[];
  hideActions?: boolean;
  title?: React.ReactNode;
  subTitle?: React.ReactNode;
  documentTitle?: string;
  tabs?: IPageTab[];
  filterMode?: FilterMode;
  showFilters?: boolean;
  pageActionRoutes?: React.ReactElement;
}> = memo(
  ({
    actions,
    hideActions,
    title,
    subTitle,
    documentTitle,
    tabs,
    children,
    filterMode = FilterMode.None,
    showFilters = false,
    pageActionRoutes,
  }) => {
    const {
      setPageActions,
      setPageActionRoutes,
      setHideActions,
      setTitle,
      setSubTitle,
      setDocumentTitle,
      setFilterMode,
      setShowFilters,
      journalTypes,
      setJournalTypes,
      searchText,
      setSearchText,
      setTabs,
    } = usePageContext();

    useEffect(() => {
      if (actions === undefined) {
        return;
      }

      setPageActions(actions);
    }, [setPageActions, actions]);

    useEffect(() => {
      if (pageActionRoutes === undefined) {
        return;
      }

      setPageActionRoutes(pageActionRoutes);
    }, [setPageActionRoutes, pageActionRoutes]);

    useEffect(
      () => setHideActions(hideActions ?? false),
      [hideActions, setHideActions],
    );

    useEffect(() => {
      if (tabs === undefined) {
        return;
      }

      setTabs(tabs);
    }, [setTabs, tabs]);

    useEffect(() => {
      if (title === undefined) {
        return;
      }

      setTitle(title);
    }, [setTitle, title]);

    useEffect(() => setSubTitle(subTitle), [subTitle, setSubTitle]);

    useEffect(
      () => setDocumentTitle(documentTitle ?? ""),
      [documentTitle, setDocumentTitle],
    );

    useEffect(() => setFilterMode(filterMode), [filterMode, setFilterMode]);

    useEffect(() => setShowFilters(showFilters), [showFilters, setShowFilters]);

    const searchString = useRouterState({
      select: (s): string => s.location.searchStr,
    });
    const navigate = useNavigate();

    useEffect(() => {
      return () => {
        if (showFilters) {
          setShowFilters(false);
        }

        if (filterMode !== FilterMode.None) {
          setFilterMode(FilterMode.None);
        }

        if (searchText) {
          setSearchText("");
        }

        if (journalTypes?.length) {
          setJournalTypes([]);
        }

        if (tabs?.length) {
          setTabs([]);
        }

        if (searchString && searchString !== "?") {
          void (navigate as unknown as SearchOnlyNavigate)({
            search: () => ({}),
            replace: true,
          });
        }

        if (pageActionRoutes) {
          setPageActionRoutes(null);
        }

        if (actions?.length) {
          setPageActions([]);
        }
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <FadeInContainer testId={"page"}>{children}</FadeInContainer>;
  },
);
