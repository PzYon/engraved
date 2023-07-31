import React from "react";
import { IScrapMeasurement } from "../../../../serverApi/IScrapMeasurement";
import { ScrapBody } from "../ScrapBody";
import { ScrapList } from "./ScrapList";

export const ScripListBody: React.FC<{
  scrap: IScrapMeasurement;
  hideDate: boolean;
  hideActions?: boolean;
  editMode: boolean;
  setEditMode: (value: boolean) => void;
  hasTitleFocus: boolean;
  value: string;
  onChange: (value: string) => void;
}> = ({
  scrap,
  hideDate,
  hideActions,
  editMode,
  setEditMode,
  hasTitleFocus,
  value,
  onChange,
}) => {
  return (
    <ScrapBody
      scrap={scrap}
      editMode={editMode}
      setEditMode={setEditMode}
      hideDate={hideDate}
      hideActions={hideActions}
      actions={[]}
    >
      <ScrapList
        isEditMode={editMode}
        hasTitleFocus={hasTitleFocus}
        value={value}
        onChange={onChange}
      />
    </ScrapBody>
  );
};
