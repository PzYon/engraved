import React, { useEffect } from "react";
import { useMetricDetailsContext } from "./MetricDetailsContext";
import { MetricType } from "../../serverApi/MetricType";
import { MetricDetailsRouter } from "./MetricDetailsRouter";
import { NotesDetailsRouter } from "./notes/NotesDetailsRouter";
import { useAppContext } from "../../AppContext";
import { PageTitle } from "./PageTitle";
import { styled, Typography } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import { EditMetricPermissionsLauncher } from "./edit/EditMetricPermissionsLauncher";
import { FormatDate } from "../common/FormatDate";

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
      <Typography component="div">
        <PropertiesContainer>
          {metric.editedOn ? (
            <PropertyContainer>
              Edited <FormatDate value={metric.editedOn} />
            </PropertyContainer>
          ) : null}
          {metric.description ? (
            <PropertyContainer>{metric.description}</PropertyContainer>
          ) : null}
        </PropertiesContainer>
      </Typography>

      {metric.type === MetricType.Notes ? (
        <NotesDetailsRouter />
      ) : (
        <MetricDetailsRouter />
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

const PropertiesContainer = styled("div")`
  padding: 0 ${(p) => p.theme.spacing(2)};

  & > span:not(:last-of-type)::after {
    content: "\\00B7";
    margin: 0 ${(p) => p.theme.spacing(2)};
  }
`;

const PropertyContainer = styled("span")``;
