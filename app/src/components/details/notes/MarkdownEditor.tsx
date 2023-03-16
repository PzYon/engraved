import React, { Suspense } from "react";
import { Theme, useTheme } from "@mui/material";

export interface ICodeMirrorProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  theme?: Theme;
}

const LazyCodeMirror = React.lazy(() => import("./LazyCodeMirror"));

export const MarkdownEditor: React.FC<ICodeMirrorProps> = (props) => {
  const theme = useTheme();

  return (
    <Suspense fallback={<div />}>
      <LazyCodeMirror
        {...props}
        value={props.value ?? ""}
        theme={props.theme ?? theme}
      />
    </Suspense>
  );
};
