import React from "react";
import { DetailsSection } from "../../layout/DetailsSection";
import { useMetricContext } from "../MetricDetailsContext";
import { Markdown } from "./Markdown";
import { Page } from "../../common/Page";
import { getMetricHeaderActions } from "../../overview/getMetricHeaderActions";
import { PageTitle } from "../PageTitle";

export const NotesViewPage: React.FC = () => {
  const { metric } = useMetricContext();

  return (
    <Page
      title={<PageTitle metric={metric} />}
      actions={getMetricHeaderActions(metric)}
    >
      <DetailsSection>
        <Markdown value={metric.notes} />
      </DetailsSection>
    </Page>
  );
};
