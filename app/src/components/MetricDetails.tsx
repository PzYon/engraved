import React, { useEffect, useState } from "react";
import { IMeasurement } from "../serverApi/IMeasurement";
import { envSettings } from "../envSettings";
import { useParams } from "react-router";
import { ServerApi } from "../serverApi/ServerApi";
import { Tab, Tabs } from "@mui/material";
import { translations } from "../i18n/translations";
import { Link, LinkProps, Route, Routes, useLocation } from "react-router-dom";
import { MeasurementsList } from "./MeasurementsList";
import { MetricSummary } from "./MetricSummary";

type NavigateTo = "summary" | "measurements";

export const MetricDetails: React.FC = () => {
  const { metricKey } = useParams();
  const { pathname } = useLocation();

  const [tabKey, setTabKey] = useState<NavigateTo>(() =>
    pathname.indexOf("measurements") > -1 ? "measurements" : "summary"
  );

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
      <Tabs value={tabKey}>
        <Tab
          value={"summary"}
          href={getOnClickUrl("summary")}
          onClick={() => setTabKey("summary")}
          label={translations.tab_summary}
          LinkComponent={LinkToSummary}
        />
        <Tab
          value={"measurements"}
          href={getOnClickUrl("measurements")}
          onClick={() => setTabKey("measurements")}
          label={translations.tab_measurements}
          LinkComponent={LinkToMeasurements}
        />
      </Tabs>
      <Routes>
        <Route index element={<MetricSummary />} />
        <Route path={getOnClickUrl("summary")} element={<MetricSummary />} />
        <Route
          path={getOnClickUrl("measurements")}
          element={<MeasurementsList measurements={measurements} />}
        />
      </Routes>
      {errorMessage ? <div>{errorMessage}</div> : null}
    </>
  );

  function getOnClickUrl(target: NavigateTo) {
    return target;
  }
};

// eslint-disable-next-line react/display-name
const LinkToMeasurements = React.forwardRef<HTMLAnchorElement, LinkProps>(
  (props, ref) => {
    return <Link to={"measurements"} ref={ref} {...props} />;
  }
);

// eslint-disable-next-line react/display-name
const LinkToSummary = React.forwardRef<HTMLAnchorElement, LinkProps>(
  (props, ref) => {
    return <Link to={"summary"} ref={ref} {...props} />;
  }
);
