import React, { useEffect, useState } from "react";
import { IMetric } from "../../serverApi/IMetric";
import { ServerApi } from "../../serverApi/ServerApi";
import { useAppContext } from "../../AppContext";
import { Section } from "../layout/Section";
import { Box, Typography } from "@mui/material";
import { MetricListHeaderActions } from "./MetricListHeaderActions";
import { Link } from "react-router-dom";
import { AddOutlined } from "@mui/icons-material";
import { AddMetricLauncher } from "./AddMetricLauncher";
import { MetricTypeIcon, MetricTypeIconStyle } from "../common/MetricTypeIcon";

export const MetricList: React.FC<{ showCreate?: boolean }> = ({
  showCreate,
}) => {
  const [metrics, setMetrics] = useState<IMetric[]>([]);

  const { setAppAlert, setPageTitle, setTitleActions } = useAppContext();

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

    setPageTitle("All Your Metrix");

    setTitleActions([
      {
        href: "/metrics/create",
        icon: <AddOutlined />,
        label: "Add Metric",
        key: "add_metric",
      },
    ]);

    return () => {
      setPageTitle(null);
      setTitleActions([]);
    };
  }, []);

  return (
    <>
      {metrics.map((metric) => (
        <Section key={metric.key}>
          <Box sx={{ display: "flex" }}>
            <MetricTypeIcon
              type={metric.type}
              style={MetricTypeIconStyle.Overview}
            />
            <Box sx={{ flexGrow: 1, pl: 3 }}>
              <Link to={`/metrics/${metric.key}`}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
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

      {showCreate ? <AddMetricLauncher /> : null}
    </>
  );
};
