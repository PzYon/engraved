import React, { useEffect } from "react";
import { IScrapEntry } from "../../../../serverApi/IScrapEntry";
import { useAppContext } from "../../../../AppContext";
import { ScrapBody } from "../ScrapBody";
import { ScrapMarkdown } from "./ScrapMarkdown";
import { preloadLazyCodeMirror } from "./MarkdownEditor";
import { ActionFactory } from "../../../common/actions/ActionFactory";
import { EntryPropsRenderStyle } from "../../../common/entries/Entry";

export const ScrapMarkdownBody: React.FC<{
  scrap: IScrapEntry;
  journalName: string;
  hideActions?: boolean;
  editMode: boolean;
  setEditMode: (value: boolean) => void;
  value: string;
  onChange: (value: string) => void;
  onSave: () => Promise<void>;
  cancelEditing: () => void;
  hasFocus?: boolean;
  propsRenderStyle: EntryPropsRenderStyle;
}> = ({
  scrap,
  journalName,
  hideActions,
  editMode,
  setEditMode,
  value,
  onChange,
  onSave,
  cancelEditing,
  hasFocus,
  propsRenderStyle,
}) => {
  useEffect(() => preloadLazyCodeMirror(), []);

  const { setAppAlert } = useAppContext();

  return (
    <ScrapBody
      scrap={scrap}
      journalName={journalName}
      editMode={editMode}
      setEditMode={setEditMode}
      hideActions={hideActions}
      onSave={onSave}
      cancelEditing={cancelEditing}
      actions={[ActionFactory.copyValueToClipboard(value, setAppAlert)]}
      enableHotkeys={hasFocus}
      propsRenderStyle={propsRenderStyle}
    >
      <ScrapMarkdown
        keyMappings={{
          "Alt-s": onSave,
          "Alt-x": cancelEditing,
        }}
        isEditMode={editMode}
        value={value}
        onChange={onChange}
      />
    </ScrapBody>
  );
};
