import React, { useEffect, useState } from "react";
import { Markdown } from "../Markdown";
import { FormatDate } from "../../../common/FormatDate";
import { DetailsSection } from "../../../layout/DetailsSection";
import { styled, TextField, Typography } from "@mui/material";
import { IconButtonWrapper } from "../../../common/IconButtonWrapper";
import { ContentCopyOutlined, DeleteOutlined } from "@mui/icons-material";
import { useDeleteMeasurementMutation } from "../../../../serverApi/reactQuery/mutations/useDeleteMeasurementMutation";
import { useUpsertMeasurementMutation } from "../../../../serverApi/reactQuery/mutations/useUpsertMeasurementMutation";
import { MetricType } from "../../../../serverApi/MetricType";
import { IScrapMeasurement } from "../../../../serverApi/IScrapMeasurement";
import { IUpsertScrapsMeasurementCommand } from "../../../../serverApi/commands/IUpsertScrapsMeasurementCommand";
import { engravedTheme } from "../../../../theming/engravedTheme";
import { MarkdownEditor, preloadLazyCodeMirror } from "../MarkdownEditor";
import { FadeInContainer } from "../../../common/FadeInContainer";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const timers: { [scrapId: string]: any } = {};

export const Scrap: React.FC<{ scrap: IScrapMeasurement }> = ({ scrap }) => {
  const [notes, setNotes] = useState(scrap.notes);
  const [title, setTitle] = useState(scrap.title);

  const [editMode, setEditMode] = useState<"off" | "fromTitle" | "fromBody">(
    !scrap.id ? "fromTitle" : "off"
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

  useEffect(() => {
    preloadLazyCodeMirror();
  }, []);

  const isNew = editMode !== "off" || !scrap.id;

  return (
    <DetailsSection>
      <StyledTextField
        placeholder={"Title"}
        autoFocus={isNew}
        value={title}
        onChange={(event) => {
          clearTimeout(timers[scrap.id]);
          setTitle(event.target.value);
        }}
        onFocus={() => {
          clearTimeout(timers[scrap.id]);
          setEditMode("fromTitle");
        }}
        onBlur={onBlur}
        onClick={() => setEditMode("fromTitle")}
        sx={{ width: "100%" }}
      />
      {editMode !== "off" ? (
        <EditorContainer>
          <MarkdownEditor
            disableAutoFocus={editMode !== "fromBody"}
            showOutlineWhenFocused={true}
            value={notes ?? ""}
            onChange={(value) => {
              clearTimeout(timers[scrap.id]);
              setNotes(value);
            }}
            onBlur={onBlur}
            onFocus={() => clearTimeout(timers[scrap.id])}
          />
        </EditorContainer>
      ) : (
        <FadeInContainer>
          <Markdown
            onClick={(e) => {
              if (e.detail == 2) {
                setEditMode("fromBody");
              }
            }}
            value={scrap.notes}
            disableCustomSection={true}
          />
        </FadeInContainer>
      )}
      <FooterContainer>
        <Typography fontSize="small" component="span">
          {scrap.dateTime ? <FormatDate value={scrap.dateTime} /> : "now"}
        </Typography>
        <IconButtonWrapper
          action={{
            key: "copy",
            label: "Copy",
            icon: <ContentCopyOutlined fontSize="small" />,
            onClick: async () => {
              await navigator.clipboard.writeText(scrap.notes);
            },
          }}
        />
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

  function onBlur() {
    clearTimeout(timers[scrap.id]);

    // we use a timeout here in order to let the browser have time to
    // move the focus to the next element
    timers[scrap.id] = setTimeout(async () => {
      await upsertScrap();
      setEditMode("off");
    });
  }

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
      fontSize: "larger",
    },
    fieldset: {
      borderWidth: 0,
    },
  },
});
