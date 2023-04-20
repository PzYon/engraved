import React, { useEffect, useState } from "react";
import { Markdown } from "./Markdown";
import { FormatDate } from "../../common/FormatDate";
import { styled, TextField, Typography } from "@mui/material";
import { ContentCopyOutlined, DeleteOutlined } from "@mui/icons-material";
import { useUpsertMeasurementMutation } from "../../../serverApi/reactQuery/mutations/useUpsertMeasurementMutation";
import { MetricType } from "../../../serverApi/MetricType";
import { IScrapMeasurement } from "../../../serverApi/IScrapMeasurement";
import { IUpsertScrapsMeasurementCommand } from "../../../serverApi/commands/IUpsertScrapsMeasurementCommand";
import { engravedTheme } from "../../../theming/engravedTheme";
import { MarkdownEditor, preloadLazyCodeMirror } from "./MarkdownEditor";
import { FadeInContainer } from "../../common/FadeInContainer";
import { Actions } from "../../common/Actions";
import { useAppContext } from "../../../AppContext";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const timers: { [scrapId: string]: any } = {};

export const Scrap: React.FC<{
  scrap: IScrapMeasurement;
  hideDate?: boolean;
}> = ({ scrap, hideDate }) => {
  const [notes, setNotes] = useState(scrap.notes);
  const [title, setTitle] = useState(scrap.title);

  const [editMode, setEditMode] = useState<"off" | "fromTitle" | "fromBody">(
    !scrap.id ? "fromTitle" : "off"
  );

  const upsertMeasurementMutation = useUpsertMeasurementMutation(
    scrap.metricId,
    MetricType.Scraps,
    scrap
  );

  useEffect(() => {
    preloadLazyCodeMirror();
  }, []);

  const { setAppAlert } = useAppContext();

  const isNew = editMode !== "off" || !scrap.id;

  return (
    <>
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
        {hideDate ? null : (
          <Typography fontSize="small" component="span" sx={{ mr: 2 }}>
            {scrap.dateTime ? <FormatDate value={scrap.dateTime} /> : "now"}
          </Typography>
        )}

        <Actions
          actions={[
            {
              key: "copy",
              label: "Copy",
              icon: <ContentCopyOutlined fontSize="small" />,
              onClick: async () => {
                await navigator.clipboard.writeText(scrap.notes);
                setAppAlert({
                  type: "success",
                  title: "Successfully copied text to clipboard.",
                  hideDurationSec: 1,
                });
              },
            },
            {
              key: "delete",
              label: "Delete",
              icon: <DeleteOutlined fontSize="small" />,
              href: `measurements/${scrap.id}/delete`,
            },
          ]}
        />
      </FooterContainer>
    </>
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
  display: flex;
  justify-content: end;
  align-items: center;
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
