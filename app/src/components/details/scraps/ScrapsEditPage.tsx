import React, { useState } from "react";
import { useMetricContext } from "../MetricDetailsContext";
import { useNavigate } from "react-router-dom";
import { Page } from "../../layout/pages/Page";
import { MetricPageTitle } from "../MetricPageTitle";
import { getCommonEditModeActions } from "../../overview/getCommonActions";
import { EditCommonProperties } from "../edit/EditCommonProperties";
import { useEditMetricMutation } from "../../../serverApi/reactQuery/mutations/useEditMetricMutation";
import { EditPageFooterButtons } from "../../common/EditPageFooterButtons";

export const ScrapsEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { metric } = useMetricContext();

  const [name, setName] = useState(metric.name);
  const [description, setDescription] = useState(metric.description);

  const editMetricMutation = useEditMetricMutation(metric.id);

  const disableSave =
    name === metric.name && description === metric.description;

  const navigateToViewPage = () => navigate("./..");

  return (
    <Page
      title={<MetricPageTitle metric={metric} />}
      subTitle="Edit"
      documentTitle={`Edit ${metric.name}`}
      actions={[
        ...getCommonEditModeActions(navigateToViewPage, save, disableSave),
      ]}
    >
      <EditCommonProperties
        name={name}
        setName={setName}
        description={description}
        setDescription={setDescription}
      />
      <EditPageFooterButtons
        onSave={save}
        disableSave={disableSave}
        onCancel={navigateToViewPage}
      />
    </Page>
  );

  async function save() {
    await editMetricMutation.mutateAsync({
      metric: { ...metric, name, description },
      onSuccess: navigateToViewPage,
    });
  }
};
