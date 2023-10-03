import React from "react";
import { IScrapEntry } from "../../../../serverApi/IScrapEntry";
import { ScrapBody } from "../ScrapBody";
import { ScrapList } from "./ScrapList";

export const ScrapListBody: React.FC<{
  scrap: IScrapEntry;
  hideDate: boolean;
  hideActions?: boolean;
  editMode: boolean;
  setEditMode: (value: boolean) => void;
  hasTitleFocus: boolean;
  value: string;
  onChange: (value: string) => void;
  onSave: () => Promise<void>;
  cancelEditing: () => void;
  hasFocus?: boolean;
}> = ({
  scrap,
  hideDate,
  hideActions,
  editMode,
  setEditMode,
  hasTitleFocus,
  value,
  onChange,
  onSave,
  cancelEditing,
  hasFocus,
}) => (
  <ScrapBody
    scrap={scrap}
    editMode={editMode}
    setEditMode={setEditMode}
    hideDate={hideDate}
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
    />
  </ScrapBody>
);
