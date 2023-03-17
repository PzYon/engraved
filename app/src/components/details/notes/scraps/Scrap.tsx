import React, { useState } from "react";
import { Markdown } from "../Markdown";
import { FormatDate } from "../../../common/FormatDate";
import { DetailsSection } from "../../../layout/DetailsSection";
import { styled, TextField, Typography } from "@mui/material";
import { IconButtonWrapper } from "../../../common/IconButtonWrapper";
import { DeleteOutlined } from "@mui/icons-material";
import { useDeleteMeasurementMutation } from "../../../../serverApi/reactQuery/mutations/useDeleteMeasurementMutation";
import { useUpsertMeasurementMutation } from "../../../../serverApi/reactQuery/mutations/useUpsertMeasurementMutation";
import { MetricType } from "../../../../serverApi/MetricType";
import { IScrapMeasurement } from "../../../../serverApi/IScrapMeasurement";
import { IUpsertScrapsMeasurementCommand } from "../../../../serverApi/commands/IUpsertScrapsMeasurementCommand";
import { engravedTheme } from "../../../../theming/engravedTheme";
import { MarkdownEditor } from "../MarkdownEditor";

export const Scrap: React.FC<{ scrap: IScrapMeasurement }> = ({ scrap }) => {
  const [notes, setNotes] = useState(scrap.notes);
  const [title, setTitle] = useState(scrap.title);

  const [editMode, setEditMode] = useState<"no" | "fromTitle" | "fromNotes">(
    scrap.id ? "no" : "fromNotes"
  );

  const deleteMeasurementMutation = useDeleteMeasurementMutation(
    scrap.metricId,
    scrap.id
  );

  const upsertMeasurementMutation = useUpsertMeasurementMutation(
    scrap.metricId,
    MetricType.Scraps,
    scrap
  );

  return (
    <DetailsSection>
      <StyledTextField
        value={title}
        onChange={(v) => setTitle(v.target.value)}
        placeholder={"Title"}
        onBlur={upsertScrap}
        onClick={() => setEditMode("fromTitle")}
        sx={{ width: "100%" }}
      />
      {editMode !== "no" ? (
        <EditorContainer>
          <MarkdownEditor
            value={notes ?? ""}
            onChange={setNotes}
            disableAutoFocus={editMode === "fromTitle"}
            onBlur={async () => {
              setEditMode("no");
              await upsertScrap();
            }}
          />
        </EditorContainer>
      ) : (
        <Markdown
          onClick={() => setEditMode("fromNotes")}
          value={scrap.notes}
        />
      )}
      <FooterContainer>
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
      </FooterContainer>
    </DetailsSection>
  );

  async function upsertScrap() {
    if (scrap.notes === notes && scrap.title === title) {
      return;
    }

    if (!notes) {
      return;
    }

    await upsertMeasurementMutation.mutate({
      command: {
        id: scrap?.id,
        notes: notes,
        title: title,
        metricAttributeValues: {},
        metricId: scrap.metricId,
        dateTime: new Date(),
      } as IUpsertScrapsMeasurementCommand,
    });
  }
};

const FooterContainer = styled("div")`
  text-align: right;
`;

const EditorContainer = styled("div")`
  .cm-editor {
    padding: 0;
  }
`;

const StyledTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    input: {
      padding: 0,
      color: engravedTheme.palette.primary.main,
    },
    fieldset: {
      borderWidth: 0,
    },
  },
});
