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
import { preloadLazyCodeMirror } from "./markdown/MarkdownEditor";
import { Actions } from "../../common/Actions";
import { useAppContext } from "../../../AppContext";
import { ScrapMarkdown } from "./markdown/ScrapMarkdown";
import { ScrapList } from "./list/ScrapList";

export const Scrap: React.FC<{
  scrap: IScrapMeasurement;
  hideDate?: boolean;
}> = ({ scrap, hideDate }) => {
  const [notes, setNotes] = useState(scrap.notes);
  const [title, setTitle] = useState(scrap.title);

  const [isEditMode, setIsEditMode] = useState(!scrap.id);
  const [hasTitleFocus, setHasTitleFocus] = useState(false);

  const { setAppAlert } = useAppContext();

  useEffect(() => {
    preloadLazyCodeMirror();
  }, []);

  useEffect(() => {
    if (!isEditMode && notes !== scrap.notes) {
      upsertScrap();
    }
  }, [isEditMode]);

  const upsertMeasurementMutation = useUpsertMeasurementMutation(
    scrap.metricId,
    MetricType.Scraps,
    scrap
  );

  return (
    <ClickAwayListener onClickAway={() => setIsEditMode(false)}>
      <div
        onClick={(e) => {
          if (e.detail === 2) {
            setIsEditMode(true);
          }
        }}
      >
        <StyledTextField
          placeholder={"Title"}
          value={title}
          disabled={!isEditMode}
          onChange={(event) => {
            setTitle(event.target.value);
          }}
          onFocus={() => setHasTitleFocus(true)}
          onBlur={() => setHasTitleFocus(false)}
          sx={{ width: "100%", color: "deeppink" }}
        />

        {scrap.scrapType === ScrapType.List ? (
          <ScrapList
            isEditMode={isEditMode}
            hasTitleFocus={hasTitleFocus}
            value={notes}
            onChange={onChange}
          />
        ) : (
          <ScrapMarkdown
            isEditMode={isEditMode}
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

const StyledTextField = styled(TextField)`
  input {
    padding: 0;
    font-size: larger;
    color: ${(p) => p.theme.palette.primary.main} !important;
    -webkit-text-fill-color: ${(p) => p.theme.palette.primary.main} !important;
  }

  fieldset {
    border-width: 0;
  }
`;
