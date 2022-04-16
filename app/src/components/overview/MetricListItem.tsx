import React from "react";
import { IMetric } from "../../serverApi/IMetric";
import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { MetricHeaderActions } from "./MetricHeaderActions";
import { Section } from "../layout/Section";
import { MetricProperties } from "./MetricProperties";
import { MetricTypeIcon, MetricTypeIconStyle } from "../common/MetricTypeIcon";

export const MetricListItem: React.FC<{ metric: IMetric }> = ({ metric }) => {
  return (
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
                fontWeight: "lighter",
                display: "flex",
                alignItems: "center",
              }}
            >
              {metric.name}
            </Typography>
          </Link>
          <Typography>{metric.description}</Typography>
          <MetricProperties metric={metric} />
        </Box>
        <Box>
          <MetricHeaderActions metric={metric} />
        </Box>
      </Box>
    </Section>
  );
};
