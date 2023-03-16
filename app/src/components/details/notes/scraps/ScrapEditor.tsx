import React, { useState } from "react";
import { IMeasurement } from "../../../../serverApi/IMeasurement";
import { useUpsertMeasurementMutation } from "../../../../serverApi/reactQuery/mutations/useUpsertMeasurementMutation";
import { MetricType } from "../../../../serverApi/MetricType";
import { MarkdownEditor } from "../MarkdownEditor";
import { IUpsertMeasurementCommand } from "../../../../serverApi/commands/IUpsertMeasurementCommand";
import { useDeleteMeasurementMutation } from "../../../../serverApi/reactQuery/mutations/useDeleteMeasurementMutation";

export const ScrapEditor: React.FC<{
  scrap: IMeasurement;
  onBlur: () => void;
}> = ({ scrap, onBlur }) => {
  const [notes, setNotes] = useState(scrap.notes ?? "");

  const upsertMeasurementMutation = useUpsertMeasurementMutation(
    scrap.metricId,
    MetricType.Scraps,
    scrap
  );

  const deleteMeasurementMutation = useDeleteMeasurementMutation(
    scrap.metricId,
    scrap.id
  );

  return (
    <MarkdownEditor
      value={notes}
      onChange={setNotes}
      onBlur={async () => {
        if (scrap.notes !== notes) {
          await executeMutation();
        }

        onBlur();
      }}
    ></MarkdownEditor>
  );

  async function executeMutation() {
    if (!notes) {
      await deleteMeasurementMutation.mutate();
      return;
    }

    await upsertMeasurementMutation.mutate({
      command: {
        id: scrap?.id,
        notes: notes,
        metricAttributeValues: {},
        metricId: scrap.metricId,
        dateTime: new Date(),
      } as IUpsertMeasurementCommand,
    });
  }
};
