import React, { useEffect, useState } from "react";
import { IMeasurement } from "../../serverApi/IMeasurement";
import { useParams } from "react-router";
import { ServerApi } from "../../serverApi/ServerApi";
import { IMetric } from "../../serverApi/IMetric";
import { Visualization } from "./chart/Visualization";
import { useAppContext } from "../../AppContext";
import { EditMetric } from "./edit/EditMetric";
import { MeasurementsList } from "./MeasurementsList";
import { IApiError } from "../../serverApi/IApiError";
import { AccordionSection } from "../layout/AccordionSection";
import { AddOutlined, ModeEditOutlineOutlined } from "@mui/icons-material";
import { translations } from "../../i18n/translations";
import { renderAddMeasurementDialog } from "./add/renderAddMeasurementDialog";
import { useDialogContext } from "../layout/dialogs/DialogContext";
import { Route, Routes } from "react-router-dom";

export const MetricDetails: React.FC = () => {
  const { metricKey } = useParams();

  const { setPageTitle, setTitleActions, setAppAlert } = useAppContext();

  const { renderDialog } = useDialogContext();

  const [metric, setMetric] = useState<IMetric>();
  const [measurements, setMeasurements] = useState<IMeasurement[]>([]);
  const [isDataReady, setIsDataReady] = useState(false);

  useEffect(() => {
    Promise.all([getMeasurements(), getMetric()]).then(() =>
      setIsDataReady(true)
    );
  }, []);

  useEffect(() => {
    setPageTitle(metric?.name);
    setTitleActions([
      {
        key: "edit",
        label: translations.edit,
        href: `/metrics/${metricKey}/edit`,
        icon: <ModeEditOutlineOutlined />,
      },
      {
        key: "add",
        label: translations.add,
        onClick: () => renderAddMeasurementDialog(renderDialog, metric),
        icon: <AddOutlined />,
      },
    ]);
    return () => {
      setPageTitle(null);
      setTitleActions([]);
    };
  }, [metric]);

  if (!isDataReady) {
    return null;
  }

  return (
    <Routes>
      <Route path="/edit" element={<EditMetric metric={metric} />} />
      <Route
        path="/"
        element={
          <>
            <AccordionSection title="Chart" expanded={true}>
              <Visualization metric={metric} measurements={measurements} />
            </AccordionSection>

            <AccordionSection title="All Measurements">
              <MeasurementsList metric={metric} measurements={measurements} />
            </AccordionSection>
          </>
        }
      />
    </Routes>
  );

  function getMetric() {
    return ServerApi.getMetric(metricKey)
      .then(setMetric)
      .catch((e) => handleError(`Error loading Metric ${metricKey}`, e));
  }

  function getMeasurements() {
    return ServerApi.getMeasurements(metricKey)
      .then(setMeasurements)
      .catch((e) => handleError("Error loading measurements", e));
  }

  function handleError(title: string, error: Error | IApiError) {
    setAppAlert({
      title: title,
      message: error.message,
      type: "error",
    });
  }
};
