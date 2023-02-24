import React, { useState } from "react";
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
import { useEditMetricMutation } from "../../../serverApi/reactQuery/mutations/useEditMetricMutation";

export const MetricEditPage: React.FC = () => {
  const { metric } = useMetricContext();

  const [name, setName] = useState(metric.name);
  const [description, setDescription] = useState(metric.description);
  const [attributes, setAttributes] = useState(metric.attributes);
  const [thresholds, setThresholds] = useState(metric.thresholds ?? {});
  const [uiSettings, setUiSettings] = useState(
    metric.customProps?.uiSettings
      ? JSON.parse(metric.customProps.uiSettings)
      : { groupByTime: GroupByTime.Month }
  );

  const navigate = useNavigate();

  const editMetricMutation = useEditMetricMutation(metric.id);

  return (
    <Page
      title={<PageTitle metric={metric} />}
      documentTitle={`Edit ${metric.name}`}
      actions={getCommonEditModeActions(navigate, () =>
        editMetricMutation.mutate({
          metric: {
            ...metric,
            name,
            description,
            attributes,
            thresholds,
            customProps: {
              uiSettings,
            },
          },
          onSuccess: () => {
            navigate("./..");
          },
        })
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
