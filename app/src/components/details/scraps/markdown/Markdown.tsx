import React, { MouseEventHandler, Suspense } from "react";

export interface IMarkdownProps {
  value: string;
  onClick?: MouseEventHandler;
  useBasic?: boolean;
}

const LazyMarkdown = React.lazy(() => import("./LazyMarkdown"));

export const Markdown: React.FC<IMarkdownProps> = ({
  value,
  onClick,
  useBasic,
}) => {
  return (
    <Suspense fallback={<div />}>
      <LazyMarkdown value={value} onClick={onClick} useBasic={useBasic} />
    </Suspense>
  );
};
