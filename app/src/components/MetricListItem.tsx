import React from "react";
import { IMetric } from "../serverApi/IMetric";
import { Card, CardContent, styled, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export const MetricListItem: React.FC<{ metric: IMetric }> = ({ metric }) => {
  return (
    <StyledLink to={"/metrics/" + metric.key}>
      <Card>
        <CardContent>
          <Typography variant={"h4"}>{metric.name}</Typography>
          <Typography variant={"subtitle1"}>{metric.description}</Typography>
        </CardContent>
      </Card>
    </StyledLink>
  );
};

const StyledLink = styled(Link)({
  textDecoration: "none",
});
