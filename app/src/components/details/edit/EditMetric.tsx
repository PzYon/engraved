import { IMetric } from "../../../serverApi/IMetric";
import React, { useState } from "react";
import { Button, FormControl, TextField } from "@mui/material";
import { translations } from "../../../i18n/translations";
import { ServerApi } from "../../../serverApi/ServerApi";
import { useAppContext } from "../../../AppContext";

export const EditMetric: React.FC<{
  metric: IMetric;
  onSaved: () => Promise<unknown>;
}> = ({ metric, onSaved }) => {
  const [attributeJson, setAttributeJson] = useState(
    metric.attributes ? JSON.stringify(metric.attributes) : ""
  );

  const [name, setName] = useState(metric.name);
  const [description, setDescription] = useState(metric.description);

  const { setAppAlert } = useAppContext();

  return (
    <FormControl>
      <TextField
        value={name}
        onChange={(event) => setName(event.target.value)}
        label={translations.label_metricName}
        margin={"normal"}
      />
      <TextField
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        multiline={true}
        label={"Description"}
        margin={"normal"}
      />
      <TextField
        value={attributeJson}
        onChange={(event) => setAttributeJson(event.target.value)}
        multiline={true}
        label={"Metric Attributes JSON"}
        margin={"normal"}
      />
      <Button
        variant="outlined"
        onClick={() => {
          ServerApi.editMetric(
            metric.id,
            name,
            description,
            JSON.parse(attributeJson)
          )
            .then(() => {
              setAppAlert({
                title: "Saved metric",
                type: "success",
              });

              onSaved();
            })
            .catch((e) => {
              setAppAlert({
                title: "Failed to edit metric",
                message: e.message,
                type: "error",
              });
            });
        }}
      >
        {translations.save}
      </Button>
    </FormControl>
  );
};
