import React from "react";
import { ActionFactory } from "../../../common/actions/ActionFactory";
import { ScrapBody } from "../ScrapBody";
import { useAppContext } from "../../../../AppContext";
import { useScrapContext } from "../ScrapContext";
import { RichTextEditor } from "../../../common/RichTextEditor";
import { FadeInContainer } from "../../../common/FadeInContainer";
import { Markdown } from "./Markdown";
import { IAction } from "../../../common/actions/IAction";

export const ScrapMarkdown: React.FC<{ editModeActions?: IAction[] }> = ({
  editModeActions = [],
}) => {
  const { setAppAlert } = useAppContext();

  const { notes, title, setNotes, isEditMode } = useScrapContext();

  return (
    <ScrapBody
      actions={[ActionFactory.copyValueToClipboard(notes, setAppAlert)]}
    >
      {isEditMode ? (
        <div style={{ marginTop: "10px" }}>
          <RichTextEditor
            initialValue={notes ?? ""}
            setValue={setNotes}
            autoFocus={!!title}
            showFormattingOptions={true}
            editModeActions={[...editModeActions]}
          />
        </div>
      ) : (
        <FadeInContainer>
          <Markdown value={notes} />
        </FadeInContainer>
      )}
    </ScrapBody>
  );
};
