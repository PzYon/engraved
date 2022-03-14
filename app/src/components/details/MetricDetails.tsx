import React, { useEffect, useState } from "react";
import { IMeasurement } from "../../serverApi/IMeasurement";
import { envSettings } from "../../env/envSettings";
import { useParams } from "react-router";
import { ServerApi } from "../../serverApi/ServerApi";
import { IMetric } from "../../serverApi/IMetric";
import { Visualization } from "./chart/Visualization";
import { Section } from "../layout/Section";
import { AddMeasurement } from "./add/AddMeasurement";
import { useAppContext } from "../../AppContext";
import { EditMetric } from "./edit/EditMetric";
import { MeasurementsList } from "./MeasurementsList";

const serverApi = new ServerApi(envSettings.apiBaseUrl);

export const MetricDetails: React.FC = () => {
  const { metricKey } = useParams();

  const appContext = useAppContext();

  const [metric, setMetric] = useState<IMetric>();
  const [measurements, setMeasurements] = useState<IMeasurement[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isDataReady, setIsDataReady] = useState(false);

  useEffect(() => {
    Promise.all([getMeasurements(), getMetric()]).then(() =>
      setIsDataReady(true)
    );
  }, []);

  useEffect(() => {
    appContext.setPageTitle(metric?.name);
    return () => appContext.setPageTitle(null);
  }, [metric]);

  if (!isDataReady) {
    return null;
  }

  return (
    <>
      <Section>
        <AddMeasurement metric={metric} onAdded={getMeasurements} />
      </Section>
      <Section>
        <EditMetric metric={metric} />
      </Section>
      <Section>
        <Visualization measurements={measurements} metric={metric} />
      </Section>
      <Section>
        <MeasurementsList metric={metric} measurements={measurements} />
      </Section>
      {errorMessage ? <div>{errorMessage}</div> : null}
    </>
  );

  function getMetric() {
    return serverApi.getMetric(metricKey).then(setMetric).catch(handleError);
  }

  function getMeasurements() {
    return serverApi
      .getMeasurements(metricKey)
      .then(setMeasurements)
      .catch(handleError);
  }

  function handleError(error: unknown) {
    setErrorMessage(typeof error === "string" ? error : JSON.stringify(error));
  }
};
