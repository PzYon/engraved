import { MarkdownEditor } from "./MarkdownEditor";
import { FadeInContainer } from "../../../common/FadeInContainer";
import { Markdown } from "./Markdown";
import React, { useState } from "react";
import { styled } from "@mui/material";
import { ActionFactory } from "../../../common/actions/ActionFactory";
import { ScrapBody } from "../ScrapBody";
import { useAppContext } from "../../../../AppContext";
import { useScrapContext } from "../ScrapContext";
import AutoFixHigh from "@mui/icons-material/AutoFixHigh";
import DisplaySettingsIcon from "@mui/icons-material/DisplaySettings";
import { ScrapType } from "../../../../serverApi/IScrapEntry";
import { getRawRowValues } from "./getRawRowValues";
import { TextEditor } from "../../../common/TextEditor";

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

  const [isEditableDiv, setIsEditableDiv] = useState(false);

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
        {
          onClick: () => {
            setIsEditableDiv(!isEditableDiv);
          },
          key: "change-editor",
          icon: <DisplaySettingsIcon fontSize="small" />,
          label: "Use other editor",
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
          {isEditableDiv ? (
            <TextEditor initialValue={notes ?? ""} setValue={setNotes} />
          ) : (
            <MarkdownEditor
              showOutlineWhenFocused={true}
              value={notes ?? ""}
              onChange={setNotes}
              keyMappings={{
                "Alt-s": upsertScrap,
                "Alt-x": cancelEditingAction?.onClick,
              }}
            />
          )}
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
