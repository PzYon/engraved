import React from "react";
import { useTheme } from "@mui/material";
import { LazyLoadSuspender } from "../../../common/lazyLoadComponent";
import { MuiTheme } from "../../../../theming/engravedTheme";

export type KeyMappings = Record<string, () => void>;

export interface ICodeMirrorProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  theme?: MuiTheme;
  showOutlineWhenFocused?: boolean;
  keyMappings?: KeyMappings;
}

const LazyCodeMirror = React.lazy(() => import("./LazyCodeMirror"));

export const MarkdownEditor: React.FC<ICodeMirrorProps> = (props) => {
  const theme = useTheme();

  return (
    <LazyLoadSuspender>
      <LazyCodeMirror
        {...props}
        value={props.value ?? ""}
        theme={props.theme ?? theme}
      />
    </LazyLoadSuspender>
  );
};
