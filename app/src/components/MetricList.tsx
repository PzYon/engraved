import React, { useEffect, useState } from "react";
import { IMetric } from "../serverApi/IMetric";
import { envSettings } from "../envSettings";
import { MetricListItem } from "./MetricListItem";
import { Link } from "react-router-dom";
import { ServerApi } from "../serverApi/ServerApi";

export const MetricList: React.FC = () => {
  const [metrics, setMetrics] = useState<IMetric[]>([]);

  useEffect(() => {
    new ServerApi(envSettings.apiBaseUrl)
      .getMetrics()
      .then((data) => {
        setMetrics(data);
      })
      .catch((err) => {
        alert(
          "Error: " + (typeof err === "string" ? err : JSON.stringify(err))
        );
      });
  }, []);

  return (
    <ul>
      {metrics.map((m) => (
        <li key={m.key}>
          <Link to={"/metrics/" + m.key}>
            <MetricListItem metric={m} />
          </Link>
        </li>
      ))}
    </ul>
  );
};
