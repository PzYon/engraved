import React, { useState } from "react";
import { IMeasurement } from "../../../../serverApi/IMeasurement";
import { Markdown } from "../Markdown";
import { FormatDate } from "../../../common/FormatDate";
import { ScrapEditor } from "./ScrapEditor";
import { DetailsSection } from "../../../layout/DetailsSection";
import { styled, Typography } from "@mui/material";
import { IconButtonWrapper } from "../../../common/IconButtonWrapper";
import { DeleteOutlined } from "@mui/icons-material";
import { useDeleteMeasurementMutation } from "../../../../serverApi/reactQuery/mutations/useDeleteMeasurementMutation";

export const Scrap: React.FC<{ scrap: IMeasurement }> = ({ scrap }) => {
  const [isEditMode, setIsEditMode] = useState(!scrap.id);

  const deleteMeasurementMutation = useDeleteMeasurementMutation(
    scrap.metricId,
    scrap.id
  );

  return (
    <DetailsSection>
      <DateContainer>
        <Typography fontSize="small" component="span">
          {scrap.dateTime ? <FormatDate value={scrap.dateTime} /> : "now"}
        </Typography>
        <IconButtonWrapper
          action={{
            key: "delete",
            label: "Delete",
            icon: <DeleteOutlined fontSize="small" />,
            onClick: () => deleteMeasurementMutation.mutate(),
          }}
        />
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
