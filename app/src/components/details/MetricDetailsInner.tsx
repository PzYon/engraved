import React, { useEffect } from "react";
import { IMetric } from "../../serverApi/IMetric";
import { MetricTypeIcon, MetricTypeIconStyle } from "../common/MetricTypeIcon";
import styled from "styled-components";
import { useMetricDetailsContext } from "./MetricDetailsContext";
import { useDialogContext } from "../layout/dialogs/DialogContext";
import { translations } from "../../i18n/translations";
import { useAppContext } from "../../AppContext";
import { AddOutlined, ModeEditOutlineOutlined } from "@mui/icons-material";
import { renderAddMeasurementDialog } from "./add/renderAddMeasurementDialog";
import { Typography } from "@mui/material";
import { EditMetricLauncher } from "./edit/EditMetricLauncher";
import { Visualization } from "./chart/Visualization";
import { EditMeasurementLauncher } from "./edit/EditMeasurementLauncher";
import { DeleteMeasurementLauncher } from "./edit/DeleteMeasurementLauncher";
import { Route, Routes } from "react-router-dom";
import { DetailsSection } from "../layout/DetailsSection";
import { MeasurementsList } from "./dataTable/MeasurementsList";
import { SelectedAttributeValues } from "./SelectedAttributeValues";

export const MetricDetailsInner: React.FC<{ metricId: string }> = ({
  metricId,
}) => {
  const { metric, measurements, reloadMeasurements, reloadMetric } =
    useMetricDetailsContext();

  const { setPageTitle, setTitleActions } = useAppContext();

  const { renderDialog } = useDialogContext();

  useEffect(() => {
    setPageTitle(<PageTitle metric={metric} />);
    setTitleActions([
      {
        key: "edit",
        label: translations.edit,
        href: `/metrics/${metricId}/edit`,
        icon: <ModeEditOutlineOutlined />,
      },
      {
        key: "add",
        label: translations.add,
        onClick: () =>
          renderAddMeasurementDialog(metric, renderDialog, () => {
            reloadMeasurements();
            reloadMetric();
          }),
        icon: <AddOutlined />,
      },
    ]);

    return () => {
      setPageTitle(null);
      setTitleActions([]);
    };
  }, [metric]);

  if (!metric || !measurements) {
    return null;
  }

  if (!metric) {
    return <Typography>Nothing here.</Typography>;
  }

  return (
    <>
      {metric.description ? (
        <Typography>{metric.description}</Typography>
      ) : null}

      <DetailsSection>
        <Visualization metric={metric} measurements={measurements} />
      </DetailsSection>

      <DetailsSection>
        <SelectedAttributeValues attributes={metric.attributes} />
      </DetailsSection>

      <DetailsSection overflowXScroll={true}>
        <MeasurementsList metric={metric} measurements={measurements} />
      </DetailsSection>

      <Routes>
        <Route
          path="/edit"
          element={
            <EditMetricLauncher metric={metric} reloadMetric={reloadMetric} />
          }
        />
        <Route
          path="/measurements/:measurementId/edit"
          element={
            <EditMeasurementLauncher
              metric={metric}
              measurements={measurements}
              onSaved={reloadMeasurements}
            />
          }
        />
        <Route
          path="/measurements/:measurementId/delete"
          element={
            <DeleteMeasurementLauncher
              metric={metric}
              onDeleted={reloadMeasurements}
            />
          }
        />
      </Routes>
    </>
  );
};

const PageTitle: React.FC<{ metric: IMetric }> = ({ metric }) => {
  if (!metric) {
    return null;
  }

  return (
    <Host>
      <MetricTypeIcon
        type={metric?.type}
        style={MetricTypeIconStyle.PageTitle}
      />
      <Title>{metric?.name}</Title>
    </Host>
  );
};

const Host = styled.div`
  display: flex;
  justify-content: center;
`;

const Title = styled.div`
  flex-grow: 1;
`;
