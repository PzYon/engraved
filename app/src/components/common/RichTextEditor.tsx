import React from "react";
import { LazyLoadSuspender } from "./LazyLoadSuspender";
import { IRichTextEditorProps } from "./IRichTextEditorProps";

const RTE = React.lazy(() => import("./LazyRichTextEditor"));

export const RichTextEditor: React.FC<IRichTextEditorProps> = (
  props: IRichTextEditorProps,
) => {
  return (
    <LazyLoadSuspender>
      <RTE {...props} />
    </LazyLoadSuspender>
  );
};
