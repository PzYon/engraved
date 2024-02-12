import { MarkdownEditor, preloadLazyCodeMirror } from "./MarkdownEditor";
import { FadeInContainer } from "../../../common/FadeInContainer";
import { Markdown } from "./Markdown";
import React, { useEffect } from "react";
import { styled } from "@mui/material";
import { ActionFactory } from "../../../common/actions/ActionFactory";
import { ScrapBody } from "../ScrapBody";
import { useAppContext } from "../../../../AppContext";
import { useScrapContext } from "../ScrapContext";

export const ScrapMarkdown: React.FC = () => {
  useEffect(() => preloadLazyCodeMirror(), []);

  const { setAppAlert } = useAppContext();

  const { notes, setNotes, isEditMode, getCancelEditingFunction, upsertScrap } =
    useScrapContext();

  return (
    <ScrapBody
      actions={[ActionFactory.copyValueToClipboard(notes, setAppAlert)]}
    >
      {getSomething()}
    </ScrapBody>
  );

  function getSomething() {
    if (isEditMode) {
      return (
        <EditorContainer>
          <MarkdownEditor
            showOutlineWhenFocused={true}
            value={notes ?? ""}
            onChange={setNotes}
            keyMappings={{
              "Alt-s": upsertScrap,
              "Alt-x": getCancelEditingFunction(),
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
