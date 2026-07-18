import React from "react";
import { IMarkdownProps } from "./IMarkdownProps";

const LazyMarkdown = React.lazy(() => import("./LazyMarkdown"));

// Intentionally no Suspense boundary here: while the markdown chunk is
// loading, suspension bubbles up to the nearest ancestor boundary
// (OverviewList, DialogWrapper or the route outlet in App), so that
// surrounding content (item frame, title, footer) is held back too and
// everything appears complete in one go instead of every markdown fragment
// showing its own spinner.
export const Markdown: React.FC<IMarkdownProps> = (props) => (
  <LazyMarkdown {...props} />
);
