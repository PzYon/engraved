import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { markdown } from "@codemirror/lang-markdown";
import { EditorView, keymap } from "@codemirror/view";
import { defaultKeymap } from "@codemirror/commands";
import { ICodeMirrorProps } from "./MarkdownEditor";
import { alpha } from "@mui/material";

const customKeyMap = [
  {
    key: "Tab",
    run: () => true,
    shift: () => true,
  },
  {
    key: "Tab-Shift",
    run: () => true,
    shift: () => true,
  },
  ...defaultKeymap,
];

const LazyCodeMirror: React.FC<ICodeMirrorProps> = ({
  value,
  onChange,
  onBlur,
  onFocus,
  theme,
  disableAutoFocus,
  showOutlineWhenFocused,
}) => {
  return (
    <CodeMirror
      value={value}
      extensions={[
        markdown({}),
        EditorView.lineWrapping,
        keymap.of(customKeyMap),
      ]}
      onChange={onChange}
      onBlur={onBlur}
      onFocus={onFocus}
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
          outline: showOutlineWhenFocused
            ? `2px solid ${theme.palette.primary.main}`
            : 0,
          borderRadius: "3px",
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
