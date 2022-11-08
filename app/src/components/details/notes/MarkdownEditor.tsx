import React, { Suspense } from "react";
import { styled, Theme, useTheme } from "@mui/material";

export interface ICodeMirrorProps {
  value: string;
  onChange: (value: string) => void;
  theme: Theme;
}

const LazyCodeMirror = React.lazy(() => import("./LazyCodeMirror"));

export const MarkdownEditor: React.FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => {
  const theme = useTheme();

  return (
    <Host>
      <Suspense fallback={<div />}>
        <LazyCodeMirror value={value} onChange={onChange} theme={theme} />
      </Suspense>
    </Host>
  );
};

const Host = styled("div")`
  margin-top: ${(p) => p.theme.spacing(2)};
`;
