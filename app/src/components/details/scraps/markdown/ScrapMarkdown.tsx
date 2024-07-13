import { MarkdownEditor } from "./MarkdownEditor";
import { FadeInContainer } from "../../../common/FadeInContainer";
import { Markdown } from "./Markdown";
import React from "react";
import { styled } from "@mui/material";
import { ActionFactory } from "../../../common/actions/ActionFactory";
import { ScrapBody } from "../ScrapBody";
import { useAppContext } from "../../../../AppContext";
import { useScrapContext } from "../ScrapContext";
import { AutoFixHigh } from "@mui/icons-material";
import { ScrapType } from "../../../../serverApi/IScrapEntry";
import { getRawRowValues } from "./getRawRowValues";

export const ScrapMarkdown: React.FC = () => {
  const { setAppAlert } = useAppContext();

  const {
    notes,
    setNotes,
    isEditMode,
    cancelEditingAction,
    upsertScrap,
    changeScrapType,
  } = useScrapContext();

  return (
    <ScrapBody
      editModeActions={[
        {
          onClick: () => {
            changeScrapType(getRawRowValues(notes), ScrapType.List);
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
