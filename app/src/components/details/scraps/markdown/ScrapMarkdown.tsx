import { MarkdownEditor } from "./MarkdownEditor";
import { FadeInContainer } from "../../../common/FadeInContainer";
import { Markdown } from "./Markdown";
import React from "react";
import { editModeKind } from "../Scrap";
import { styled } from "@mui/material";

export const ScrapMarkdown: React.FC<{
  editMode: editModeKind;
  setEditMode: (mode: editModeKind) => void;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  onFocus: () => void;
}> = ({ editMode, setEditMode, value, onChange, onBlur, onFocus }) => {
  if (editMode !== "off") {
    return (
      <EditorContainer>
        <MarkdownEditor
          disableAutoFocus={editMode !== "fromBody"}
          showOutlineWhenFocused={true}
          value={value ?? ""}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
        />
      </EditorContainer>
    );
  }

  return (
    <FadeInContainer>
      <Markdown
        onClick={(e) => {
          if (e.detail == 2) {
            setEditMode("fromBody");
          }
        }}
        value={value}
      />
    </FadeInContainer>
  );
};

const EditorContainer = styled("div")`
  .cm-editor {
    padding: 0;
  }
`;
