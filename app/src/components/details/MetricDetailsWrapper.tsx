import React, { useEffect } from "react";
import { useMetricDetailsContext } from "./MetricDetailsContext";
import { MetricType } from "../../serverApi/MetricType";
import { MetricDetailsContent } from "./MetricDetailsContent";
import { NotesDetailsContent } from "./notes/NotesDetailsContent";
import { useAppContext } from "../../AppContext";
import { PageTitle } from "./PageTitle";
import { DetailsSection } from "../layout/DetailsSection";
import { Typography } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import { EditMetricPermissionsLauncher } from "./edit/EditMetricPermissionsLauncher";

export const MetricDetailsWrapper: React.FC = () => {
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
        <NotesDetailsContent metric={metric} />
      ) : (
        <MetricDetailsContent />
      )}

      <Routes>
        <Route
          path="/permissions"
          element={<EditMetricPermissionsLauncher metric={metric} />}
        />
      </Routes>
    </>
  );
};
