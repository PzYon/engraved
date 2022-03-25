import React, { useEffect, useState } from "react";
import { IMetric } from "../../serverApi/IMetric";
import { ServerApi } from "../../serverApi/ServerApi";
import { useAppContext } from "../../AppContext";
import { AddOutlined, VisibilityOutlined } from "@mui/icons-material";
import { Section } from "../layout/Section";
import { HeaderActions } from "../layout/HeaderActions";
import { Typography } from "@mui/material";
import styled from "styled-components";
import { AddMeasurementDialog } from "../details/add/AddMeasurementDialog";

export const MetricList: React.FC = () => {
  const [metrics, setMetrics] = useState<IMetric[]>([]);

  const [showAddMeasurementFor, setShowAddMeasurementFor] = useState<IMetric>();

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
      {showAddMeasurementFor ? (
        <AddMeasurementDialog
          metric={showAddMeasurementFor}
          onClose={() => setShowAddMeasurementFor(null)}
        />
      ) : null}
      {metrics.map((m) => (
        <Section key={m.key}>
          <MainContainer>
            <LeftContainer>
              <Typography variant="h5">{m.name}</Typography>
              <Typography>{m.description}</Typography>
            </LeftContainer>
            <ChildContainer>
              <HeaderActions
                actions={[
                  {
                    key: "add_measurement",
                    label: "Add Measurement",
                    icon: <AddOutlined />,
                    onClick: () => setShowAddMeasurementFor(m),
                  },
                  {
                    key: "view",
                    label: "View",
                    icon: <VisibilityOutlined />,
                    href: `/metrics/view/${m.key}`,
                  },
                ]}
              />
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
