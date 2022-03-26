import React, { useEffect, useState } from "react";
import { IMetric } from "../../serverApi/IMetric";
import { ServerApi } from "../../serverApi/ServerApi";
import { useAppContext } from "../../AppContext";
import { Section } from "../layout/Section";
import { Typography } from "@mui/material";
import styled from "styled-components";
import { MetricListHeaderActions } from "./MetricListHeaderActions";

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
          <MainContainer>
            <LeftContainer>
              <Typography variant="h5">{metric.name}</Typography>
              <Typography>{metric.description}</Typography>
            </LeftContainer>
            <ChildContainer>
              <MetricListHeaderActions metric={metric} />
            </ChildContainer>
          </MainContainer>
        </Section>
      ))}
    </>
  );
};

const MainContainer = styled.div`
  display: flex;
`;

const ChildContainer = styled.div``;

const LeftContainer = styled(ChildContainer)`
  flex-grow: 1;
`;
