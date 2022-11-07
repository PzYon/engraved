import React from "react";
import { DetailsSection } from "../../layout/DetailsSection";
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
      actions={getCommonActions(metric)}
    >
      <DetailsSection>
        <Markdown value={metric.notes} />
      </DetailsSection>
    </Page>
  );
};
