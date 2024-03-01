import React, { MouseEventHandler } from "react";
import { LazyLoadSuspender } from "../../../common/lazyLoadComponent";

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
    <LazyLoadSuspender>
      <LazyMarkdown value={value} onClick={onClick} useBasic={useBasic} />
    </LazyLoadSuspender>
  );
};
