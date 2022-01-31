import React, { useEffect, useState } from "react";
import { IMeasurement } from "../serverApi/IMeasurement";
import { envSettings } from "../env/envSettings";
import { useParams } from "react-router";
import { ServerApi } from "../serverApi/ServerApi";
import { Tab, Tabs } from "@mui/material";
import { translations } from "../i18n/translations";
import { Link, LinkProps, Route, Routes, useLocation } from "react-router-dom";
import { MeasurementsList } from "./MeasurementsList";
import { MetricSummary } from "./MetricSummary";

type TabKey = "summary" | "measurements";

export const MetricDetails: React.FC = () => {
  const { metricKey } = useParams();
  const { pathname } = useLocation();

  const [tabKey, setTabKey] = useState<TabKey>(() =>
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
        <WrappedTab
          value={getPath("summary")}
          label={translations.tab_summary}
          onClick={setTabKey}
        />
        <WrappedTab
          value={getPath("measurements")}
          label={translations.tab_measurements}
          onClick={setTabKey}
        />
      </Tabs>
      <Routes>
        <Route index element={<MetricSummary />} />
        <Route path={getPath("summary")} element={<MetricSummary />} />
        <Route
          path={getPath("measurements")}
          element={<MeasurementsList measurements={measurements} />}
        />
      </Routes>
      {errorMessage ? <div>{errorMessage}</div> : null}
    </>
  );
};

const WrappedTab: React.FC<{
  value: TabKey;
  label: string;
  onClick: (value: TabKey) => void;
}> = ({ value, label, onClick }) => {
  return (
    <Tab
      href={value}
      onClick={() => onClick(value)}
      label={label}
      LinkComponent={React.forwardRef<HTMLAnchorElement, LinkProps>(
        function ReactRouterLinkComponentWrapper(props, ref) {
          return <Link to={value} ref={ref} {...props} />;
        }
      )}
    />
  );
};

function getPath(target: TabKey) {
  return target;
}
