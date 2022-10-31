import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { markdown } from "@codemirror/lang-markdown";
import { EditorView } from "@codemirror/view";
import { ICodeMirrorProps } from "./MarkdownEditor";

const LazyCodeMirror: React.FC<ICodeMirrorProps> = ({
  value,
  onChange,
  theme,
}) => (
  <CodeMirror
    value={value}
    extensions={[markdown({})]}
    onChange={onChange}
    theme={EditorView.theme({
      "&": {
        fontSize: theme.typography.fontSize + "px",
        backgroundColor: theme.palette.common.white,
      },
    })}
  />
);

export default LazyCodeMirror;
