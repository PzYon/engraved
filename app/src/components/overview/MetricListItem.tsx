import React, { useEffect, useRef } from "react";
import { IMetric } from "../../serverApi/IMetric";
import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { MetricHeaderActions } from "./MetricHeaderActions";
import { MetricProperties } from "./MetricProperties";
import { MetricTypeIcon } from "../common/MetricTypeIcon";
import { DeviceWidth, useDeviceWidth } from "../common/useDeviceWidth";
import { IconStyle } from "../common/Icon";
import { PageSection } from "../layout/pages/PageSection";
import { MetricItemWrapper } from "./MetricItemWrapper";
import { Wrapper } from "../common/wrappers/Wrapper";

export const MetricListItem: React.FC<{
  metric: IMetric;
  addWrapper?: (scrapWrapper: MetricItemWrapper) => void;
  index?: number;
  onClick?: () => void;
  isFocused?: boolean;
}> = ({ metric, addWrapper, index, onClick, isFocused }) => {
  const deviceWidth = useDeviceWidth();
  const domElementRef = useRef<HTMLDivElement>();

  useEffect(() => {
    if (!addWrapper) {
      return;
    }

    addWrapper(new MetricItemWrapper(domElementRef, metric));
  }, [metric]);

  return (
    <Wrapper ref={domElementRef} tabIndex={index} onClick={onClick}>
      <PageSection key={metric.id}>
        <Box sx={{ display: "flex" }}>
          <MetricTypeIcon type={metric.type} style={IconStyle.Overview} />
          <Box sx={{ flexGrow: 1, pl: 3, wordBreak: "break-all" }}>
            <Link to={`/metrics/${metric.id}`}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: "lighter",
                  display: "flex",
                  alignItems: "center",
                  lineHeight: 1,
                  marginTop: "-3px",
                }}
              >
                {metric.name}
              </Typography>
            </Link>
            <Typography>{metric.description}</Typography>
            <MetricProperties metric={metric} />
            {deviceWidth === DeviceWidth.Small ? (
              <Box sx={{ display: "flex", mt: 2 }}>
                <MetricHeaderActions
                  metric={metric}
                  enableHotkeys={isFocused}
                />
              </Box>
            ) : null}
          </Box>
          {deviceWidth !== DeviceWidth.Small ? (
            <Box>
              <MetricHeaderActions metric={metric} enableHotkeys={isFocused} />
            </Box>
          ) : null}
        </Box>
      </PageSection>
    </Wrapper>
  );
};
