import React from "react";
import { IScrapEntry } from "../../../../serverApi/IScrapEntry";
import { ScrapBody } from "../ScrapBody";
import { ScrapList } from "./ScrapList";
import { EntryPropsRenderStyle } from "../../../common/entries/Entry";

export const ScrapListBody: React.FC<{
  scrap: IScrapEntry;
  hideActions?: boolean;
  editMode: boolean;
  setEditMode: (value: boolean) => void;
  hasTitleFocus: boolean;
  value: string;
  onChange: (value: string) => void;
  onSave: (notesToSave?: string) => Promise<void>;
  cancelEditing: () => void;
  hasFocus?: boolean;
  propsRenderStyle: EntryPropsRenderStyle;
  journalName: string;
}> = ({
  scrap,
  journalName,
  hideActions,
  editMode,
  setEditMode,
  hasTitleFocus,
  value,
  onChange,
  onSave,
  cancelEditing,
  hasFocus,
  propsRenderStyle,
}) => (
  <ScrapBody
    scrap={scrap}
    journalName={journalName}
    editMode={editMode}
    setEditMode={setEditMode}
    propsRenderStyle={propsRenderStyle}
    hideActions={hideActions}
    actions={[]}
    onSave={onSave}
    cancelEditing={cancelEditing}
    enableHotkeys={hasFocus || hasTitleFocus}
  >
    <ScrapList
      isEditMode={editMode}
      hasTitleFocus={hasTitleFocus}
      value={value}
      onChange={onChange}
      editedOn={scrap.editedOn}
      onSave={onSave}
    />
  </ScrapBody>
);
