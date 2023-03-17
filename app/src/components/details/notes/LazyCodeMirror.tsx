import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { markdown } from "@codemirror/lang-markdown";
import { EditorView } from "@codemirror/view";
import { ICodeMirrorProps } from "./MarkdownEditor";
import { alpha } from "@mui/material";

const LazyCodeMirror: React.FC<ICodeMirrorProps> = ({
  value,
  onChange,
  onBlur,
  theme,
  disableAutoFocus,
}) => {
  return (
    <CodeMirror
      value={value}
      extensions={[markdown({}), EditorView.lineWrapping]}
      onChange={onChange}
      onBlur={onBlur}
      autoFocus={!disableAutoFocus}
      basicSetup={{
        lineNumbers: false,
        syntaxHighlighting: false,
        foldGutter: false,
      }}
      theme={EditorView.theme({
        "&": {
          fontSize: theme.typography.fontSize * 1.1 + "px",
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.common.white,
          padding: theme.spacing(2),
        },
        "&.cm-editor.cm-focused": {
          outline: 0,
        },
        ".cm-activeLine": {
          backgroundColor: alpha(theme.palette.background.default, 0.3),
        },
        ".cm-selectionBackground": {
          backgroundColor: theme.palette.background.default,
        },
        ".cm-selectionMatch": {
          backgroundColor: alpha(theme.palette.background.default, 0.7),
        },
      })}
    />
  );
};

export default LazyCodeMirror;
