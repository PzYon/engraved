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
import { useAppContext } from "../../../AppContext";

export const Scrap: React.FC<{
  scrap: IScrapMeasurement;
  hideDate?: boolean;
  hideActions?: boolean;
  onSuccess?: () => void;
  style?: CSSProperties;
}> = ({ scrap: currentScrap, hideDate, hideActions, onSuccess, style }) => {
  const [scrapToRender, setScrapToRender] = useState(currentScrap);

  const [notes, setNotes] = useState(scrapToRender.notes);
  const [title, setTitle] = useState(scrapToRender.title);

  const [isEditMode, setIsEditMode] = useState(!scrapToRender.id);

  const { setAppAlert } = useAppContext();

  useEffect(() => {
    if (!currentScrap.editedOn) {
      console.log("return because !scrap.editedOn");
      return;
    }

    if (currentScrap.editedOn === scrapToRender.editedOn) {
      console.log("return because scrap.editedOn === lastEditedOn");
      return;
    }

    if (isEditMode) {
      setAppAlert({
        message: "Would NOTIFY (edit mode)",
        type: "info",
        hideDurationSec: 2,
        title: "New scrap",
      });
    } else {
      setAppAlert({
        message: "Would UPDATE (view only)",
        type: "info",
        hideDurationSec: 2,
        title: "New scrap",
      });
      setScrapToRender(currentScrap);
    }
  }, [currentScrap]);

  useEffect(() => {
    preloadLazyCodeMirror();
  }, []);

  return (
    <ScrapInner
      scrap={scrapToRender}
      title={title}
      setTitle={setTitle}
      notes={notes}
      setNotes={setNotes}
      isEditMode={isEditMode}
      setIsEditMode={setIsEditMode}
      hideDate={hideDate}
      hideActions={hideActions}
      onSuccess={onSuccess}
      style={style}
    />
  );
};

export const ScrapInner: React.FC<{
  scrap: IScrapMeasurement;
  isEditMode: boolean;
  setIsEditMode: (value: boolean) => void;
  title: string;
  setTitle: (value: string) => void;
  notes: string;
  setNotes: (value: string) => void;
  hideDate?: boolean;
  hideActions?: boolean;
  onSuccess?: () => void;
  style?: CSSProperties;
}> = ({
  scrap,
  isEditMode,
  setIsEditMode,
  title,
  setTitle,
  notes,
  setNotes,
  hideDate,
  hideActions,
  onSuccess,
  style,
}) => {
  const [hasTitleFocus, setHasTitleFocus] = useState(false);

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
          onSave={upsertScrap}
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
          onSave={upsertScrap}
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
