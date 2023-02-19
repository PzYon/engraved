import React, { useState } from "react";
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
import { EditCommonProperties } from "./EditCommonProperties";
import { useMutation, useQueryClient } from "react-query";
import { queryKeysFactory } from "../../../serverApi/queryKeysFactory";

export const MetricEditPage: React.FC = () => {
  const navigate = useNavigate();

  const { metric } = useMetricContext();

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

  const queryClient = useQueryClient();

  const editMetricMutation = useMutation({
    mutationKey: queryKeysFactory.editMetric(metric.id),
    mutationFn: async () => {
      await ServerApi.editMetric(
        metric.id,
        name,
        description,
        metric.notes,
        attributes,
        thresholds,
        uiSettings
      );
    },
    onSuccess: async () => {
      setAppAlert({
        title: "Saved metric",
        type: "success",
      });

      await queryClient.invalidateQueries(
        queryKeysFactory.getMetric(metric.id)
      );

      navigate("./..");
    },
    onError: (error) => {
      // use error boundary for this?
      setAppAlert({
        title: "Failed to edit metric",
        message: error.toString(),
        type: "error",
      });
    },
  });

  return (
    <Page
      title={<PageTitle metric={metric} />}
      documentTitle={`Edit ${metric.name}`}
      actions={getCommonEditModeActions(navigate, () =>
        editMetricMutation.mutate()
      )}
    >
      <EditCommonProperties
        name={name}
        setName={setName}
        description={description}
        setDescription={setDescription}
      />

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
};
