import React, { useState } from "react";
import { IMeasurement } from "../../../../serverApi/IMeasurement";
import { Markdown } from "../Markdown";
import { FormatDate } from "../../../common/FormatDate";
import { ScrapEditor } from "./ScrapEditor";
import { DetailsSection } from "../../../layout/DetailsSection";

export const Scrap: React.FC<{ scrap: IMeasurement }> = ({ scrap }) => {
  const [isEditMode, setIsEditMode] = useState(!scrap.id);

  return (
    <DetailsSection>
      {scrap.dateTime ? <FormatDate value={scrap.dateTime} /> : "now"}
      {isEditMode ? (
        <ScrapEditor scrap={scrap} onBlur={() => setIsEditMode(false)} />
      ) : (
        <Markdown onClick={() => setIsEditMode(true)} value={scrap.notes} />
      )}
    </DetailsSection>
  );
};
