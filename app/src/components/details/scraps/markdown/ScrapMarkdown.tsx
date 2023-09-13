import { KeyMappings, MarkdownEditor } from "./MarkdownEditor";
import { FadeInContainer } from "../../../common/FadeInContainer";
import { Markdown } from "./Markdown";
import React from "react";
import { styled } from "@mui/material";

export const ScrapMarkdown: React.FC<{
  isEditMode: boolean;
  value: string;
  onChange: (value: string) => void;
  keyMappings?: KeyMappings;
}> = ({ isEditMode, value, onChange, keyMappings }) => {
  if (isEditMode) {
    return (
      <EditorContainer>
        <MarkdownEditor
          showOutlineWhenFocused={true}
          value={value ?? ""}
          onChange={onChange}
          keyMappings={keyMappings}
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
