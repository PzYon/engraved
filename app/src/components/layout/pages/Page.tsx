import React, { memo, useEffect, useRef } from "react";
import { FilterMode, usePageContext } from "./PageContext";
import { FadeInContainer } from "../../common/FadeInContainer";
import { IAction } from "../../common/actions/IAction";
import { IPageTab } from "../tabs/IPageTab";

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
      setTabs,
    } = usePageContext();

    // Sync all page props to context in a single effect
    useEffect(() => {
      if (actions !== undefined) {
        setPageActions(actions);
      }
      if (pageActionRoutes !== undefined) {
        setPageActionRoutes(pageActionRoutes);
      }
      setHideActions(hideActions ?? false);
      if (tabs !== undefined) {
        setTabs(tabs);
      }
      if (title !== undefined) {
        setTitle(title);
      }
      setSubTitle(subTitle);
      setDocumentTitle(documentTitle ?? "");
      setFilterMode(filterMode);
      setShowFilters(showFilters);
    }, [
      actions,
      pageActionRoutes,
      hideActions,
      tabs,
      title,
      subTitle,
      documentTitle,
      filterMode,
      showFilters,
      setPageActions,
      setPageActionRoutes,
      setHideActions,
      setTabs,
      setTitle,
      setSubTitle,
      setDocumentTitle,
      setFilterMode,
      setShowFilters,
    ]);

    // Store current prop values in a ref so cleanup can access them without
    // needing them in the dependency array (which would re-run on every change).
    const propsRef = useRef({
      showFilters,
      filterMode,
      tabs,
      pageActionRoutes,
      actions,
    });
    propsRef.current = {
      showFilters,
      filterMode,
      tabs,
      pageActionRoutes,
      actions,
    };

    // Reset context state when leaving the page
    useEffect(() => {
      return () => {
        const props = propsRef.current;

        if (props.showFilters) {
          setShowFilters(false);
        }
        if (props.filterMode !== FilterMode.None) {
          setFilterMode(FilterMode.None);
        }
        if (props.tabs?.length) {
          setTabs([]);
        }
        if (props.pageActionRoutes) {
          setPageActionRoutes(null);
        }
        if (props.actions?.length) {
          setPageActions([]);
        }
      };
    }, [
      setShowFilters,
      setFilterMode,
      setTabs,
      setPageActionRoutes,
      setPageActions,
    ]);

    return <FadeInContainer testId={"page"}>{children}</FadeInContainer>;
  },
);
