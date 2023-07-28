import React, { useState } from "react";
import { SearchBox } from "../../common/search/SearchBox";
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
} from "@mui/material";
import { PageSection } from "../../layout/pages/PageSection";
import { DeviceWidth, useDeviceWidth } from "../../common/useDeviceWidth";
import { FiltersColumn, FiltersRow } from "../filters/FiltersRow";
import { useMoveMeasurementMutation } from "../../../serverApi/reactQuery/mutations/useMoveMeasurementMutation";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";

export const ScrapsMovePage: React.FC = () => {
  const [searchText, setSearchText] = useState<string>("");
  const [targetMetricId, setTargetMetricId] = useState<string>(undefined);

  const navigate = useNavigate();

  const { measurementId, metricId } = useParams();
  const mutation = useMoveMeasurementMutation(measurementId, metricId, () =>
    navigate(`/metrics/${targetMetricId}`)
  );

  const metrics = useMetricsQuery(searchText, [MetricType.Scraps]);

  const deviceWidth = useDeviceWidth();
  const Row = deviceWidth === DeviceWidth.Small ? FiltersColumn : FiltersRow;

  return (
    <PageSection>
      <Row style={{ marginBottom: 0 }}>
        <SearchBox searchText={searchText} setSearchText={setSearchText} />
      </Row>

      {metrics?.length ? (
        <List dense={true}>
          {metrics.map((x) => {
            const isChecked = targetMetricId === x.id;
            return (
              <ListItem key={x.id}>
                <ListItemButton
                  role={undefined}
                  onClick={() => {
                    setTargetMetricId(isChecked ? undefined : x.id);
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
                  <ListItemText>{x.name}</ListItemText>
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
