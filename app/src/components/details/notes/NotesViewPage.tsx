import React from "react";
import { DetailsSection } from "../../layout/DetailsSection";
import { useMetricDetailsContext } from "../MetricDetailsContext";
import { Markdown } from "./Markdown";
import { Page } from "../../common/Page";
import { getMetricHeaderActions } from "../../overview/getMetricHeaderActions";

export const NotesViewPage: React.FC = () => {
  const { metric } = useMetricDetailsContext();

  return (
    <Page actions={getMetricHeaderActions(metric)}>
      <DetailsSection>
        <Markdown value={metric.notes} />
      </DetailsSection>
    </Page>
  );
};
