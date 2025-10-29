import React from "react";
import { styled } from "@mui/material";
import { ActionFactory } from "../../../common/actions/ActionFactory";
import { ScrapBody } from "../ScrapBody";
import { useAppContext } from "../../../../AppContext";
import { useScrapContext } from "../ScrapContext";
import AutoFixHigh from "@mui/icons-material/AutoFixHigh";
import { ScrapType } from "../../../../serverApi/IScrapEntry";
import { RichTextEditor } from "../../../common/RichTextEditor";
import { FadeInContainer } from "../../../common/FadeInContainer";
import { Markdown } from "./Markdown";

export const ScrapMarkdown: React.FC = () => {
  const { setAppAlert } = useAppContext();

  const { notes, setNotes, isEditMode, changeScrapType } = useScrapContext();

  return (
    <ScrapBody
      editModeActions={[
        {
          onClick: () => {
            changeScrapType(
              notes.split("\n").filter((line) => !!(line ?? "").trim()),
              ScrapType.List,
            );
          },
          key: "toggle-type",
          icon: <AutoFixHigh fontSize="small" />,
          label: "Change type to list",
        },
      ]}
      actions={[ActionFactory.copyValueToClipboard(notes, setAppAlert)]}
    >
      {getContent()}
    </ScrapBody>
  );

  function getContent() {
    if (isEditMode) {
      return (
        <EditorContainer>
          <RichTextEditor initialValue={notes ?? ""} setValue={setNotes} />
        </EditorContainer>
      );
    }

    return (
      <FadeInContainer>
        <Markdown value={notes} />
      </FadeInContainer>
    );
  }
};

const EditorContainer = styled("div")`
  .cm-editor {
    padding: 0;
  }
`;
