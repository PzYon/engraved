import React from "react";
import { IAction } from "../../../common/actions/IAction";
import { LazyLoadSuspender } from "../../../common/LazyLoadSuspender";

const LazyScrapList = React.lazy(() => import("./LazyScrapList"));

// With a boundary of its own, unlike Markdown: the list is not preloaded, and
// without one the first list to show up in a list of scraps that is on screen
// already would replace all of them with the fallback while it is loading.
export const ScrapList: React.FC<{ editModeActions?: IAction[] }> = (props) => (
  <LazyLoadSuspender>
    <LazyScrapList {...props} />
  </LazyLoadSuspender>
);
