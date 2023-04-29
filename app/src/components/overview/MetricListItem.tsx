import React from "react";
import { IMetric } from "../../serverApi/IMetric";
import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { MetricHeaderActions } from "./MetricHeaderActions";
import { MetricProperties } from "./MetricProperties";
import { MetricTypeIcon } from "../common/MetricTypeIcon";
import { DeviceWidth, useDeviceWidth } from "../common/useDeviceWidth";
import { IconStyle } from "../common/Icon";
import { PageSection } from "../layout/pages/PageSection";

export const MetricListItem: React.FC<{ metric: IMetric }> = ({ metric }) => {
  const deviceWidth = useDeviceWidth();

  return (
    <PageSection key={metric.id}>
      <Box sx={{ display: "flex" }}>
        <MetricTypeIcon type={metric.type} style={IconStyle.Overview} />
        <Box sx={{ flexGrow: 1, pl: 2, wordBreak: "break-all" }}>
          <Link to={`/metrics/${metric.id}`}>
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
          {deviceWidth === DeviceWidth.Small ? (
            <Box sx={{ display: "flex", mt: 2 }}>
              <MetricHeaderActions metric={metric} />
            </Box>
          ) : null}
        </Box>
        {deviceWidth !== DeviceWidth.Small ? (
          <Box>
            <MetricHeaderActions metric={metric} />
          </Box>
        ) : null}
      </Box>
    </PageSection>
  );
};
