import React from "react";
import { useMetricContext } from "./MetricDetailsContext";
import { MetricType } from "../../serverApi/MetricType";
import { styled, Typography } from "@mui/material";
import { Route, Routes, useNavigate } from "react-router-dom";
import { EditMetricPermissionsLauncher } from "./edit/EditMetricPermissionsLauncher";
import { FormatDate } from "../common/FormatDate";
import { NotesViewPage } from "./notes/NotesViewPage";
import { NotesEditPage } from "./notes/NotesEditPage";
import { MetricViewPage } from "./MetricViewPage";
import { MetricEditPage } from "./edit/MetricEditPage";
import { DeviceWidth, useDeviceWidth } from "../common/useDeviceWidth";
import { DeleteMetricLauncher } from "./edit/DeleteMetricLauncher";
import { IMetric } from "../../serverApi/IMetric";
import { SharedWith } from "../common/SharedWith";

export const MetricDetails: React.FC = () => {
  const { metric } = useMetricContext();
  const deviceWidth = useDeviceWidth();

  if (!metric) {
    return null;
  }

  return (
    <>
      <Typography component="div">
        <PropertiesContainer isNotLarge={deviceWidth !== DeviceWidth.Large}>
          {metric.editedOn ? (
            <PropertyContainer>
              Edited <FormatDate value={metric.editedOn} />
            </PropertyContainer>
          ) : null}
          {Object.keys(metric.permissions).length > 0 ? (
            <PropertyContainer>
              Shared with <SharedWith metric={metric} />
            </PropertyContainer>
          ) : null}
          {metric.description ? (
            <PropertyContainer>{metric.description}</PropertyContainer>
          ) : null}
        </PropertiesContainer>
      </Typography>

      <Routes>
        {metric.type === MetricType.Notes ? (
          <>
            <Route path="/edit" element={<NotesEditPage />} />
            <Route path="/*" element={<NotesViewPage />} />
          </>
        ) : (
          <>
            <Route path="/edit" element={<MetricEditPage />} />
            <Route path="/*" element={<MetricViewPage />} />
          </>
        )}
      </Routes>
      <SubRoutes metric={metric} />
    </>
  );
};

const SubRoutes: React.FC<{ metric: IMetric }> = ({ metric }) => {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route
        path="/permissions"
        element={<EditMetricPermissionsLauncher metric={metric} />}
      />
      <Route
        path="/delete"
        element={
          <DeleteMetricLauncher
            metric={metric}
            onDeleted={() => navigate("../../")}
          />
        }
      />
    </Routes>
  );
};

const PropertiesContainer = styled("div")<{ isNotLarge?: boolean }>`
  padding: 0 ${(p) => (p.isNotLarge ? p.theme.spacing(2) : 0)};

  & > span:not(:last-of-type)::after {
    content: "\\00B7";
    margin: 0 ${(p) => p.theme.spacing(2)};
  }
`;

const PropertyContainer = styled("span")`
  color: ${(p) => p.theme.palette.text.primary};
`;
