import React, { useState } from "react";
import { MetricType } from "../../../serverApi/MetricType";
import { useMetricsQuery } from "../../../serverApi/reactQuery/queries/useMetricsQuery";
import {
  Button,
  Checkbox,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { PageSection } from "../../layout/pages/PageSection";
import { useMoveMeasurementMutation } from "../../../serverApi/reactQuery/mutations/useMoveMeasurementMutation";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";

export const ScrapsMovePage: React.FC = () => {
  const [targetMetricId, setTargetMetricId] = useState<string>(undefined);

  const navigate = useNavigate();

  const { measurementId, metricId } = useParams();
  const mutation = useMoveMeasurementMutation(measurementId, metricId, () =>
    navigate(`/metrics/${targetMetricId}`)
  );

  const metrics = useMetricsQuery("", [MetricType.Scraps]);

  return (
    <PageSection>
      <Typography>Move scrap to another metric...</Typography>
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
    </PageSection>
  );
};
