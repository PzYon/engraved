import React, { useEffect, useState } from "react";
import { IMetric } from "../serverApi/IMetric";
import { envSettings } from "../envSettings";
import { MetricListItem } from "./MetricListItem";
import { ServerApi } from "../serverApi/ServerApi";
import { Grid } from "@mui/material";

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
    <Grid container rowSpacing={2} columnSpacing={2}>
      {metrics.map((m) => (
        <Grid item xs={6} sm={4} key={m.key}>
          <MetricListItem metric={m} />
        </Grid>
      ))}
    </Grid>
  );
};
