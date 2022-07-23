import React, { useEffect } from "react";
import { useParams } from "react-router";
import { IMetric } from "../../serverApi/IMetric";
import { Visualization } from "./chart/Visualization";
import { useAppContext } from "../../AppContext";
import { MeasurementsList } from "./dataTable/MeasurementsList";
import { DetailsSection } from "../layout/DetailsSection";
import { AddOutlined, ModeEditOutlineOutlined } from "@mui/icons-material";
import { translations } from "../../i18n/translations";
import { renderAddMeasurementDialog } from "./add/renderAddMeasurementDialog";
import { useDialogContext } from "../layout/dialogs/DialogContext";
import { Route, Routes } from "react-router-dom";
import { EditMetricLauncher } from "./edit/EditMetricLauncher";
import { Typography } from "@mui/material";
import { MetricTypeIcon, MetricTypeIconStyle } from "../common/MetricTypeIcon";
import styled from "styled-components";
import { EditMeasurementLauncher } from "./edit/EditMeasurementLauncher";
import { DeleteMeasurementLauncher } from "./edit/DeleteMeasurementLauncher";
import {
  MetricDetailsContextProvider,
  useMetricDetailsContext,
} from "./MetricDetailsContext";

export const MetricDetails: React.FC = () => {
  const { metricId } = useParams();

  return (
    <MetricDetailsContextProvider metricId={metricId}>
      <MetricDetailsInner metricId={metricId} />
    </MetricDetailsContextProvider>
  );
};

export const PageTitle: React.FC<{ metric: IMetric }> = ({ metric }) => {
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

export const MetricDetailsInner: React.FC<{ metricId: string }> = ({
  metricId,
}) => {
  const { metric, measurements, reloadMeasurements, reloadMetric } =
    useMetricDetailsContext();

  console.log("MEASUREMENTS", measurements);

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
