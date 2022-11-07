import React, { useState } from "react";
import { FormControl, TextField } from "@mui/material";
import { translations } from "../../../i18n/translations";
import { ServerApi } from "../../../serverApi/ServerApi";
import { useAppContext } from "../../../AppContext";
import { MetricAttributesEditor } from "./MetricAttributesEditor";
import { IMetricAttributes } from "../../../serverApi/IMetricAttributes";
import { EditThresholds } from "../thresholds/EditThresholds";
import { DetailsSection } from "../../layout/DetailsSection";
import { IMetricThresholds } from "../../../serverApi/IMetricThresholds";
import { useMetricContext } from "../MetricDetailsContext";
import { useNavigate } from "react-router-dom";
import { Page } from "../../layout/pages/Page";
import { PageTitle } from "../PageTitle";
import { getEditModeActions } from "../../overview/getCommonActions";

export const MetricEditPage: React.FC = () => {
  const navigate = useNavigate();

  const { metric, reloadMetric } = useMetricContext();

  const [attributes, setAttributes] = useState<IMetricAttributes>(
    metric.attributes
  );

  const [thresholds, setThresholds] = useState<IMetricThresholds>(
    metric.thresholds ?? {}
  );

  const [name, setName] = useState(metric.name);
  const [description, setDescription] = useState(metric.description);

  const { setAppAlert } = useAppContext();

  return (
    <Page
      title={<PageTitle metric={metric} />}
      actions={getEditModeActions(onSave, navigate)}
    >
      <DetailsSection title={"Properties"}>
        <FormControl sx={{ width: "100%" }}>
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
        </FormControl>
      </DetailsSection>

      <DetailsSection title={"Attributes"}>
        <MetricAttributesEditor
          attributes={attributes}
          setAttributes={setAttributes}
        />
      </DetailsSection>

      <DetailsSection title={"Thresholds"}>
        <EditThresholds metric={metric} onChange={setThresholds} />
      </DetailsSection>
    </Page>
  );

  function onSave() {
    {
      ServerApi.editMetric(
        metric.id,
        name,
        description,
        metric.notes,
        attributes,
        thresholds
      )
        .then(async () => {
          await reloadMetric();

          setAppAlert({
            title: "Saved metric",
            type: "success",
          });

          navigate("./..");
        })
        .catch((e) => {
          setAppAlert({
            title: "Failed to edit metric",
            message: e.message,
            type: "error",
          });
        });
    }
  }
};
