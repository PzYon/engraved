import { MarkdownEditor } from "./MarkdownEditor";
import { FadeInContainer } from "../../../common/FadeInContainer";
import { Markdown } from "./Markdown";
import React from "react";
import { styled } from "@mui/material";
import { ActionFactory } from "../../../common/actions/ActionFactory";
import { ScrapBody } from "../ScrapBody";
import { useAppContext } from "../../../../AppContext";
import { useScrapContext } from "../ScrapContext";
import { StarHalf } from "@mui/icons-material";

export const ScrapMarkdown: React.FC = () => {
  const { setAppAlert } = useAppContext();

  const { notes, setNotes, isEditMode, cancelEditingAction, upsertScrap } =
    useScrapContext();

  return (
    <ScrapBody
      editModeActions={[
        {
          onClick: () => {
            alert("toggle type");
          },
          key: "toggle-type",
          icon: <StarHalf />,
          label: "Toggle type",
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
          <MarkdownEditor
            showOutlineWhenFocused={true}
            value={notes ?? ""}
            onChange={setNotes}
            keyMappings={{
              "Alt-s": upsertScrap,
              "Alt-x": cancelEditingAction?.onClick,
            }}
          />
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
