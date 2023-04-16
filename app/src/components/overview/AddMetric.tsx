import { Button, FormControl, TextField } from "@mui/material";
import React, { useState } from "react";
import { translations } from "../../i18n/translations";
import { Section } from "../layout/Section";
import { MetricTypeSelector } from "../MetricTypeSelector";
import { MetricType } from "../../serverApi/MetricType";
import { useNavigate } from "react-router-dom";
import { ICommandResult } from "../../serverApi/ICommandResult";
import { useAddMetricMutation } from "../../serverApi/reactQuery/mutations/useAddMetricMutation";

export const AddMetric: React.FC<{ onAdded: () => void }> = ({ onAdded }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [metricType, setMetricType] = useState(MetricType.Scraps);

  const navigate = useNavigate();

  const addMetricMutation = useAddMetricMutation(
    name,
    description,
    metricType,
    async (result: ICommandResult) => {
      await onAdded();

      navigate(`/metrics/${result.entityId}/`);
    }
  );

  return (
    <Section>
      <FormControl sx={{ width: "100%" }}>
        <TextField
          value={name}
          onChange={(event) => setName(event.target.value)}
          required={true}
          label={translations.label_metricName}
          margin={"normal"}
        />
        <TextField
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          multiline={true}
          label={translations.label_metricDescription}
          margin={"normal"}
        />
        <MetricTypeSelector metricType={metricType} onChange={setMetricType} />
        <Button variant="outlined" onClick={() => addMetricMutation.mutate()}>
          {translations.create}
        </Button>
      </FormControl>
    </Section>
  );
};
