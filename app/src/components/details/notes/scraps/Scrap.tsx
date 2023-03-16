import React, { useState } from "react";
import { IMeasurement } from "../../../../serverApi/IMeasurement";
import { Markdown } from "../Markdown";
import { FormatDate } from "../../../common/FormatDate";
import { ScrapEditor } from "./ScrapEditor";
import { DetailsSection } from "../../../layout/DetailsSection";
import { styled, Typography } from "@mui/material";

export const Scrap: React.FC<{ scrap: IMeasurement }> = ({ scrap }) => {
  const [isEditMode, setIsEditMode] = useState(!scrap.id);

  return (
    <DetailsSection>
      <DateContainer>
        <Typography fontSize="small">
          {scrap.dateTime ? <FormatDate value={scrap.dateTime} /> : "now"}
        </Typography>
      </DateContainer>
      {isEditMode ? (
        <EditorContainer>
          <ScrapEditor scrap={scrap} onBlur={() => setIsEditMode(false)} />
        </EditorContainer>
      ) : (
        <Markdown onClick={() => setIsEditMode(true)} value={scrap.notes} />
      )}
    </DetailsSection>
  );
};

const DateContainer = styled("div")`
  text-align: right;
`;

const EditorContainer = styled("div")`
  .cm-editor {
    padding: 0;
  }
`;
