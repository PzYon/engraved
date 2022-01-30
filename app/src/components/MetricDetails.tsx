import React, { useEffect, useState } from "react";
import { IMeasurement } from "../serverApi/IMeasurement";
import { envSettings } from "../envSettings";
import { useParams } from "react-router";
import { ServerApi } from "../serverApi/ServerApi";
import { Tab, Tabs } from "@mui/material";
import { translations } from "../i18n/translations";
import { Route, Routes } from "react-router-dom";
import { MeasurementsList } from "./MeasurementsList";
import { MetricSummary } from "./MetricSummary";

type NavigateTo = "summary" | "measurements";

export const MetricDetails: React.FC = () => {
  const { metricKey } = useParams();

  const [measurements, setMeasurements] = useState<IMeasurement[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>();

  useEffect(() => {
    new ServerApi(envSettings.apiBaseUrl)
      .getMeasurements(metricKey)
      .then((data) => {
        setMeasurements(data);
      })
      .catch((err) => {
        setErrorMessage(typeof err === "string" ? err : JSON.stringify(err));
      });
  }, []);

  return (
    <>
      <Tabs>
        <Tab label={translations.tab_summary} href={getOnClickUrl("summary")} />
        <Tab
          label={translations.tab_measurements}
          href={getOnClickUrl("measurements")}
        />
      </Tabs>
      <Routes>
        <Route
          path={getOnClickUrl("summary")}
          element={<MeasurementsList measurements={measurements} />}
        />
        <Route
          path={getOnClickUrl("measurements")}
          element={<MetricSummary />}
        />
      </Routes>
      {errorMessage ? <div>{errorMessage}</div> : null}
    </>
  );

  function getOnClickUrl(target: NavigateTo) {
    return `/metrics/view/${metricKey}/${target}`;
  }
};
