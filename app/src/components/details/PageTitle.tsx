import React from "react";
import { IMetric } from "../../serverApi/IMetric";
import { MetricTypeIcon, MetricTypeIconStyle } from "../common/MetricTypeIcon";
import styled from "styled-components";

export const PageTitle: React.FC<{ metric: IMetric }> = ({ metric }) => {
  if (!metric) {
    return null;
  }

  return (
    <Host>
      <MetricTypeIcon
        type={metric?.type}
        style={MetricTypeIconStyle.PageTitle}
      />
      <Title>{metric?.name}</Title>
    </Host>
  );
};

const Host = styled.div`
  display: flex;
  justify-content: center;
`;

const Title = styled.div`
  flex-grow: 1;
`;
