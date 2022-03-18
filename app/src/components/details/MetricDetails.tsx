import React, { useEffect, useState } from "react";
import { IMeasurement } from "../../serverApi/IMeasurement";
import { useParams } from "react-router";
import { ServerApi } from "../../serverApi/ServerApi";
import { IMetric } from "../../serverApi/IMetric";
import { Visualization } from "./chart/Visualization";
import { Section } from "../layout/Section";
import { AddMeasurement } from "./add/AddMeasurement";
import { useAppContext } from "../../AppContext";
import { EditMetric } from "./edit/EditMetric";
import { MeasurementsList } from "./MeasurementsList";
import { IApiError } from "../../serverApi/IApiError";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";

export const MetricDetails: React.FC = () => {
  const { metricKey } = useParams();

  const { setPageTitle, setAppAlert } = useAppContext();

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
    return () => setPageTitle(null);
  }, [metric]);

  if (!isDataReady) {
    return null;
  }

  return (
    <>
      <Section title="Add Measurement">
        <AddMeasurement metric={metric} onAdded={getMeasurements} />
      </Section>
      <Section title="Edit Metric">
        <EditMetric metric={metric} />
      </Section>
      <Section>
        <Visualization metric={metric} measurements={measurements} />
      </Section>
      <Section>
        <MeasurementsList metric={metric} measurements={measurements} />
      </Section>
    </>
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
