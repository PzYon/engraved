import React, { CSSProperties, useEffect, useState } from "react";
import { useUpsertMeasurementMutation } from "../../../serverApi/reactQuery/mutations/useUpsertMeasurementMutation";
import { MetricType } from "../../../serverApi/MetricType";
import {
  IScrapMeasurement,
  ScrapType,
} from "../../../serverApi/IScrapMeasurement";
import { IUpsertScrapsMeasurementCommand } from "../../../serverApi/commands/IUpsertScrapsMeasurementCommand";
import { preloadLazyCodeMirror } from "./markdown/MarkdownEditor";
import { ScrapListBody } from "./list/ScrapListBody";
import { ScrapMarkdownBody } from "./markdown/ScrapMarkdownBody";
import { AutogrowTextField } from "../../common/AutogrowTextField";

export const Scrap: React.FC<{
  scrap: IScrapMeasurement;
  hideDate?: boolean;
  hideActions?: boolean;
  onSuccess?: () => void;
  style?: CSSProperties;
}> = ({ scrap, hideDate, hideActions, onSuccess, style }) => {
  const [notes, setNotes] = useState(scrap.notes);
  const [title, setTitle] = useState(scrap.title);

  const [isEditMode, setIsEditMode] = useState(!scrap.id);
  const [hasTitleFocus, setHasTitleFocus] = useState(false);

  useEffect(() => preloadLazyCodeMirror(), []);

  useEffect(() => {
    if (!isEditMode && notes !== scrap.notes) {
      upsertScrap();
    }
  }, [isEditMode]);

  const upsertMeasurementMutation = useUpsertMeasurementMutation(
    scrap.metricId,
    MetricType.Scraps,
    scrap.id
  );

  return (
    <div
      style={style}
      onClick={(e) => {
        if (e.detail === 2) {
          setIsEditMode(true);
        }
      }}
    >
      <AutogrowTextField
        fieldType={"title"}
        placeholder={"Title"}
        variant="outlined"
        value={title}
        disabled={!isEditMode}
        onChange={(event) => setTitle(event.target.value)}
        onFocus={() => setHasTitleFocus(true)}
        onBlur={() => setHasTitleFocus(false)}
        sx={{ width: "100%" }}
      />
      {scrap.scrapType === ScrapType.List ? (
        <ScrapListBody
          scrap={scrap}
          hideDate={hideDate}
          hideActions={hideActions}
          editMode={isEditMode}
          setEditMode={setIsEditMode}
          hasTitleFocus={hasTitleFocus}
          value={notes}
          onChange={onChange}
        />
      ) : (
        <ScrapMarkdownBody
          scrap={scrap}
          hideDate={hideDate}
          hideActions={hideActions}
          editMode={isEditMode}
          setEditMode={setIsEditMode}
          value={notes}
          onChange={onChange}
        />
      )}
    </div>
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

    onSuccess?.();
  }
};
