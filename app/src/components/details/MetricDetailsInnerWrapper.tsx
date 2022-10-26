import React, { useEffect } from "react";
import { useMetricDetailsContext } from "./MetricDetailsContext";
import { MetricType } from "../../serverApi/MetricType";
import { MetricDetailsInner } from "./MetricDetailsInner";
import { NotesDetailsInner } from "./notes/NotesDetailsInner";
import { useAppContext } from "../../AppContext";
import { PageTitle } from "./PageTitle";
import { DetailsSection } from "../layout/DetailsSection";
import { Typography } from "@mui/material";

export const MetricDetailsInnerWrapper: React.FC = () => {
  const { metric } = useMetricDetailsContext();

  const { setPageTitle } = useAppContext();

  useEffect(() => {
    setPageTitle(<PageTitle metric={metric} />);

    return () => {
      setPageTitle(null);
    };
  }, [metric]);

  if (!metric) {
    return null;
  }

  return (
    <>
      {metric.description ? (
        <DetailsSection>
          <Typography>{metric.description}</Typography>
        </DetailsSection>
      ) : null}
      {metric.type === MetricType.Notes ? (
        <NotesDetailsInner metric={metric} />
      ) : (
        <MetricDetailsInner />
      )}
    </>
  );
};
