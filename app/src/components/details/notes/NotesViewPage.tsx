import React from "react";
import { useMetricContext } from "../MetricDetailsContext";
import { Markdown } from "./Markdown";
import { Page } from "../../layout/pages/Page";
import { getCommonActions } from "../../overview/getCommonActions";
import { PageTitle } from "../PageTitle";

const sectionSeparator = "<--->";

export const NotesViewPage: React.FC = () => {
  const { metric } = useMetricContext();

  return (
    <Page
      title={<PageTitle metric={metric} />}
      actions={getCommonActions(metric)}
    >
      {metric.notes.split(sectionSeparator).map((s) => (
        <Markdown key={s} value={s} />
      ))}
    </Page>
  );
};
