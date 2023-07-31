import React, { useEffect, useState } from "react";
import { MetricType } from "../../../serverApi/MetricType";
import { useMetricsQuery } from "../../../serverApi/reactQuery/queries/useMetricsQuery";
import { Page } from "../../layout/pages/Page";
import {
  Button,
  Checkbox,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useMoveMeasurementMutation } from "../../../serverApi/reactQuery/mutations/useMoveMeasurementMutation";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import { usePageContext } from "../../layout/pages/PageContext";

export const ScrapsMovePage: React.FC = () => {
  const { setSubTitle } = usePageContext();

  const [targetMetricId, setTargetMetricId] = useState<string>(undefined);

  const navigate = useNavigate();

  const { measurementId, metricId } = useParams();
  const mutation = useMoveMeasurementMutation(measurementId, metricId, () =>
    navigate(`/metrics/${targetMetricId}`)
  );

  useEffect(() => {
    setSubTitle("Move measurement to...");
  }, []);

  const metrics = useMetricsQuery("", [MetricType.Scraps]);

  return (
    <Page subTitle="Move scrap to..." actions={[]}>
      {metrics?.length ? (
        <List dense={true}>
          {metrics
            .filter((m) => m.id !== metricId)
            .map((m) => {
              const isChecked = targetMetricId === m.id;
              return (
                <ListItem key={m.id} sx={{ padding: 0 }}>
                  <ListItemButton
                    role={undefined}
                    onClick={() => {
                      setTargetMetricId(isChecked ? undefined : m.id);
                    }}
                    dense
                  >
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={isChecked}
                        tabIndex={-1}
                        disableRipple
                      />
                    </ListItemIcon>
                    <ListItemText>{m.name}</ListItemText>
                  </ListItemButton>
                </ListItem>
              );
            })}
        </List>
      ) : null}
      {targetMetricId ? (
        <Button
          variant="contained"
          onClick={() => {
            mutation.mutate({ targetMetricId: targetMetricId });
          }}
        >
          Move
        </Button>
      ) : null}
    </Page>
  );
};
