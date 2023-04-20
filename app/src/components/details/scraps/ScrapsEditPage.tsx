import React, { useState } from "react";
import { useMetricContext } from "../MetricDetailsContext";
import { useNavigate } from "react-router-dom";
import { Page } from "../../layout/pages/Page";
import { MetricPageTitle } from "../MetricPageTitle";
import { getCommonEditModeActions } from "../../overview/getCommonActions";
import { EditCommonProperties } from "../edit/EditCommonProperties";
import { useEditMetricMutation } from "../../../serverApi/reactQuery/mutations/useEditMetricMutation";

export const ScrapsEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { metric } = useMetricContext();

  const [name, setName] = useState(metric.name);
  const [description, setDescription] = useState(metric.description);

  const editMetricMutation = useEditMetricMutation(metric.id);

  const disableSave =
    name === metric.name && description === metric.description;

  return (
    <Page
      title={<MetricPageTitle metric={metric} />}
      documentTitle={`Edit ${metric.name}`}
      actions={[
        ...getCommonEditModeActions(
          navigate,
          () =>
            editMetricMutation.mutate({
              metric: { ...metric, name, description },
              onSuccess: () => navigate("./.."),
            }),
          disableSave
        ),
      ]}
    >
      <EditCommonProperties
        name={name}
        setName={setName}
        description={description}
        setDescription={setDescription}
      />
    </Page>
  );
};
