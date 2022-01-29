import React, { useEffect, useState } from "react";
import { IMetric } from "../serverApi/IMetric";
import { envSettings } from "../envSettings";
import { MetricListItem } from "./MetricListItem";
import { ServerApi } from "../serverApi/ServerApi";
import { Grid, Typography } from "@mui/material";
import { GridItem } from "./GridItem";
import { translations } from "../i18n/translations";

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
      <GridItem key={"add"} targetUrl={"/metrics/create"}>
        <Typography variant={"h4"}>+</Typography>
        <Typography variant={"subtitle1"}>{translations.create}</Typography>
      </GridItem>
      {metrics.map((m) => (
        <GridItem key={m.key} targetUrl={`/metrics/view/${m.key}`}>
          <MetricListItem metric={m} />
        </GridItem>
      ))}
    </Grid>
  );
};
