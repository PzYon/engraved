import React, { useState } from "react";
import { FormControl, TextField } from "@mui/material";
import { translations } from "../../../i18n/translations";
import { ServerApi } from "../../../serverApi/ServerApi";
import { useAppContext } from "../../../AppContext";
import { MetricAttributesEditor } from "./MetricAttributesEditor";
import { EditThresholds } from "../thresholds/EditThresholds";
import { DetailsSection } from "../../layout/DetailsSection";
import { useMetricContext } from "../MetricDetailsContext";
import { useNavigate } from "react-router-dom";
import { Page } from "../../layout/pages/Page";
import { PageTitle } from "../PageTitle";
import { getCommonEditModeActions } from "../../overview/getCommonActions";
import { MetricUiSettings } from "./MetricUiSettings";
import { GroupByTime } from "../chart/consolidation/GroupByTime";

export const MetricEditPage: React.FC = () => {
  const navigate = useNavigate();

  const { metric, reloadMetric } = useMetricContext();

  const [attributes, setAttributes] = useState(metric.attributes);
  const [thresholds, setThresholds] = useState(metric.thresholds ?? {});
  const [uiSettings, setUiSettings] = useState(
    metric.customProps?.uiSettings
      ? JSON.parse(metric.customProps.uiSettings)
      : { groupByTime: GroupByTime.Month }
  );

  const [name, setName] = useState(metric.name);
  const [description, setDescription] = useState(metric.description);

  const { setAppAlert } = useAppContext();

  return (
    <Page
      title={<PageTitle metric={metric} />}
      actions={getCommonEditModeActions(onSave, navigate)}
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

      <DetailsSection title={"UI Settings"}>
        <MetricUiSettings uiSettings={uiSettings} onChange={setUiSettings} />
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
        thresholds,
        uiSettings
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
