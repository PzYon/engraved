import React, { useMemo } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { markdown } from "@codemirror/lang-markdown";
import { ICodeMirrorProps, KeyMappings } from "./MarkdownEditor";
import { alpha } from "@mui/material";
import { EditorView, keymap } from "@codemirror/view";
import { defaultKeymap } from "@codemirror/commands";

const LazyCodeMirror: React.FC<ICodeMirrorProps> = ({
  value,
  onChange,
  onBlur,
  onFocus,
  theme,
  showOutlineWhenFocused,
  keyMappings = {},
}) => {
  const customKeymap = useMemo(() => getKeymap(keyMappings), [keyMappings]);

  return (
    <CodeMirror
      value={value}
      extensions={[
        keymap.of(customKeymap),
        markdown({}),
        EditorView.lineWrapping,
      ]}
      onChange={onChange}
      onBlur={onBlur}
      onFocus={onFocus}
      autoFocus={false}
      onKeyDown={(e) => e.stopPropagation()}
      onKeyUp={(e) => e.stopPropagation()}
      basicSetup={{
        lineNumbers: false,
        syntaxHighlighting: false,
        foldGutter: false,
      }}
      theme={EditorView.theme({
        "&": {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.common.white,
          padding: theme.spacing(2),
          outline: `1px solid ${theme.palette.background.default}`,
          borderRadius: "3px",
        },
        ".cm-layer.cm-selectionLayer .cm-selectionBackground": {
          backgroundColor: theme.palette.primary.main,
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

function getKeymap(keyMappings: KeyMappings) {
  const newKeymap = [...defaultKeymap];

  for (const map in keyMappings) {
    newKeymap.push({
      key: map,
      run: () => {
        keyMappings[map]();
        return true;
      },
    });
  }

  return newKeymap;
}

export default LazyCodeMirror;
