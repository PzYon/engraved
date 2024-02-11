import React, { useEffect } from "react";
import { useAppContext } from "../../../../AppContext";
import { ScrapBody } from "../ScrapBody";
import { ScrapMarkdown } from "./ScrapMarkdown";
import { preloadLazyCodeMirror } from "./MarkdownEditor";
import { ActionFactory } from "../../../common/actions/ActionFactory";
import { useScrapContext } from "../ScrapContext";

export const ScrapMarkdownBody: React.FC<{
  hasFocus?: boolean;
}> = ({ hasFocus }) => {
  useEffect(() => preloadLazyCodeMirror(), []);

  const { setAppAlert } = useAppContext();

  const { notes, setNotes, isEditMode, getCancelEditingFunction, upsertScrap } =
    useScrapContext();

  return (
    <ScrapBody
      actions={[ActionFactory.copyValueToClipboard(notes, setAppAlert)]}
      enableHotkeys={hasFocus}
    >
      <ScrapMarkdown
        keyMappings={{
          "Alt-s": upsertScrap,
          "Alt-x": getCancelEditingFunction(),
        }}
        onChange={setNotes}
        isEditMode={isEditMode}
        value={notes}
      />
    </ScrapBody>
  );
};
