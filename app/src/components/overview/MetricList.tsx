import React, { useEffect, useState } from "react";
import { IMetric } from "../../serverApi/IMetric";
import { ServerApi } from "../../serverApi/ServerApi";
import { useAppContext } from "../../AppContext";
import { Section } from "../layout/Section";
import { Box, Typography } from "@mui/material";
import { MetricListHeaderActions } from "./MetricListHeaderActions";
import { Link } from "react-router-dom";

export const MetricList: React.FC = () => {
  const [metrics, setMetrics] = useState<IMetric[]>([]);

  const { setAppAlert } = useAppContext();

  useEffect(() => {
    ServerApi.getMetrics()
      .then((data) => {
        setMetrics(data);
      })
      .catch((e) => {
        setAppAlert({
          title: e.message,
          message: e.message,
          type: "error",
        });
      });
  }, []);

  return (
    <>
      {metrics.map((metric) => (
        <Section key={metric.key}>
          <Box sx={{ display: "flex" }}>
            <Box sx={{ flexGrow: 1 }}>
              <Link to={`metrics/${metric.key}`}>
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                  {metric.name}
                </Typography>
              </Link>
              <Typography>{metric.description}</Typography>
            </Box>
            <Box>
              <MetricListHeaderActions metric={metric} />
            </Box>
          </Box>
        </Section>
      ))}
    </>
  );
};
