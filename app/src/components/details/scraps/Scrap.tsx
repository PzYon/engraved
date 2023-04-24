import React, { useEffect, useState } from "react";
import { FormatDate } from "../../common/FormatDate";
import {
  ClickAwayListener,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import { ContentCopyOutlined, DeleteOutlined } from "@mui/icons-material";
import { useUpsertMeasurementMutation } from "../../../serverApi/reactQuery/mutations/useUpsertMeasurementMutation";
import { MetricType } from "../../../serverApi/MetricType";
import {
  IScrapMeasurement,
  ScrapType,
} from "../../../serverApi/IScrapMeasurement";
import { IUpsertScrapsMeasurementCommand } from "../../../serverApi/commands/IUpsertScrapsMeasurementCommand";
import { engravedTheme } from "../../../theming/engravedTheme";
import { preloadLazyCodeMirror } from "./markdown/MarkdownEditor";
import { Actions } from "../../common/Actions";
import { useAppContext } from "../../../AppContext";
import { ScrapList } from "./list/ScrapList";
import { ScrapMarkdown } from "./markdown/ScrapMarkdown";

export const Scrap: React.FC<{
  scrap: IScrapMeasurement;
  hideDate?: boolean;
}> = ({ scrap, hideDate }) => {
  const [notes, setNotes] = useState(scrap.notes);
  const [title, setTitle] = useState(scrap.title);

  const [editMode, setEditMode] = useState(!scrap.id);

  const upsertMeasurementMutation = useUpsertMeasurementMutation(
    scrap.metricId,
    MetricType.Scraps,
    scrap
  );

  useEffect(() => {
    preloadLazyCodeMirror();
  }, []);

  useEffect(() => {
    if (!editMode && notes !== scrap.notes) {
      upsertScrap();
    }
  }, [editMode]);

  const { setAppAlert } = useAppContext();

  const isNew = editMode || !scrap.id;

  return (
    <ClickAwayListener onClickAway={() => setEditMode(false)}>
      <div onClick={() => setEditMode(true)}>
        <StyledTextField
          placeholder={"Title"}
          autoFocus={isNew}
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
          }}
          sx={{ width: "100%" }}
        />

        {scrap.scrapType === ScrapType.List ? (
          <ScrapList editMode={editMode} value={notes} onChange={onChange} />
        ) : (
          <ScrapMarkdown
            editMode={editMode}
            value={notes}
            onChange={onChange}
          />
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
      </div>
    </ClickAwayListener>
  );

  function onChange(value: string) {
    setNotes(value);
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
        scrapType: scrap.scrapType,
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
