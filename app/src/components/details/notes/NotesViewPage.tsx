import React from "react";
import { useMetricContext } from "../MetricDetailsContext";
import { Markdown } from "./Markdown";
import { Page } from "../../layout/pages/Page";
import { getCommonActions } from "../../overview/getCommonActions";
import { PageTitle } from "../PageTitle";

export const NotesViewPage: React.FC = () => {
  const { metric } = useMetricContext();

  return (
    <Page
      title={<PageTitle metric={metric} />}
      documentTitle={metric.name}
      actions={getCommonActions(metric)}
    >
      <Markdown value={metric.notes} />
    </Page>
  );
};
