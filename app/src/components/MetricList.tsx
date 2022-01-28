import React, { useEffect, useState } from "react";
import { IMetric, ServerApi } from "../serverApi/IMetric";
import { envSettings } from "../envSettings";
import { MetricListItem } from "./MetricListItem";

export const MetricList: React.FC = () => {
  const [metrics, setMetrics] = useState<IMetric[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>();

  useEffect(() => {
    new ServerApi(envSettings.apiBaseUrl)
      .getMetrics()
      .then((data) => {
        setMetrics(data);
      })
      .catch((err) => {
        setErrorMessage(typeof err === "string" ? err : JSON.stringify(err));
      });
  }, []);

  return (
    <ul>
      {metrics.map((m) => {
        return (
          <li key={m.key} onClick={() => alert("selecting " + m.name)}>
            <MetricListItem metric={m} />
          </li>
        );
      })}
    </ul>
  );
};
