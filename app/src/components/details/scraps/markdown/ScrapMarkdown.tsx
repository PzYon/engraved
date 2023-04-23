import { MarkdownEditor } from "./MarkdownEditor";
import { FadeInContainer } from "../../../common/FadeInContainer";
import { Markdown } from "./Markdown";
import React from "react";
import { editModeKind } from "../Scrap";
import { styled } from "@mui/material";

export const ScrapMarkdown: React.FC<{
  editMode: editModeKind;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
}> = ({ editMode, value, onChange, onBlur }) => {
  if (editMode !== "off") {
    return (
      <EditorContainer>
        <MarkdownEditor
          disableAutoFocus={editMode !== "fromBody"}
          showOutlineWhenFocused={true}
          value={value ?? ""}
          onChange={(value) => {
            clearTimeout(timers[scrap.id]);
            onChange(value);
          }}
          onBlur={onBlur}
          onFocus={() => clearTimeout(timers[scrap.id])}
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
