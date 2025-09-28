import React from "react";
import { Theme } from "@mui/material";
import { TextEditor } from "../../../common/TextEditor";

export type KeyMappings = Record<string, () => void>;

export interface ICodeMirrorProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  theme?: Theme;
  showOutlineWhenFocused?: boolean;
  keyMappings?: KeyMappings;
}

// const LazyCodeMirror = React.lazy(() => import("./LazyCodeMirror"));

export const MarkdownEditor: React.FC<ICodeMirrorProps> = (props) => {
  // const theme = useTheme();

  return <TextEditor initialValue={props.value} setValue={props.onChange} />;

  /*
  return (
    <LazyLoadSuspender>
      <LazyCodeMirror
        {...props}
        value={props.value ?? ""}
        theme={props.theme ?? theme}
      />
    </LazyLoadSuspender>
  );
   */
};
