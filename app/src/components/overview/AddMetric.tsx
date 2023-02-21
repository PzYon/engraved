import { Button, FormControl, TextField } from "@mui/material";
import React, { useState } from "react";
import { translations } from "../../i18n/translations";
import { Section } from "../layout/Section";
import { MetricTypeSelector } from "../MetricTypeSelector";
import { MetricType } from "../../serverApi/MetricType";
import { ServerApi } from "../../serverApi/ServerApi";
import { useAppContext } from "../../AppContext";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { queryKeysFactory } from "../../serverApi/queryKeysFactory";
import { ICommandResult } from "../../serverApi/ICommandResult";

export const AddMetric: React.FC<{ onAdded: () => void }> = ({ onAdded }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [metricType, setMetricType] = useState(MetricType.Notes);

  const { setAppAlert } = useAppContext();

  const navigate = useNavigate();

  const addMetricMutation = useMutation({
    mutationKey: queryKeysFactory.addMetric(),
    mutationFn: () => ServerApi.addMetric(name, description, metricType),
    onSuccess: async (result: ICommandResult) => {
      await onAdded();

      navigate(
        `/metrics/${result.entityId}/${
          metricType === MetricType.Notes ? "edit" : ""
        }`
      );

      setAppAlert({
        title: `Added metric ${name}`,
        type: "success",
      });
    },
    onError: (error: Error) => {
      setAppAlert({
        title: "Failed to add metric",
        message: error.message,
        type: "error",
      });
    },
  });

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
