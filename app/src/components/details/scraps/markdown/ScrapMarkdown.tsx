import { MarkdownEditor } from "./MarkdownEditor";
import { FadeInContainer } from "../../../common/FadeInContainer";
import { Markdown } from "./Markdown";
import React from "react";
import { styled } from "@mui/material";

export const ScrapMarkdown: React.FC<{
  editMode: boolean;
  value: string;
  onChange: (value: string) => void;
}> = ({ editMode, value, onChange }) => {
  if (editMode) {
    return (
      <EditorContainer>
        <MarkdownEditor
          showOutlineWhenFocused={true}
          value={value ?? ""}
          onChange={onChange}
        />
      </EditorContainer>
    );
  }

  return (
    <FadeInContainer>
      <Markdown value={value} />
    </FadeInContainer>
  );
};

const EditorContainer = styled("div")`
  .cm-editor {
    padding: 0;
  }
`;
