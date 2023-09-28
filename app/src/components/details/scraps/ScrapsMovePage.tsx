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
import { PageSection } from "../../layout/pages/PageSection";
import { PageFormButtonContainer } from "../../common/FormButtonContainer";
import { Scrap } from "./Scrap";
import { useMetricContext } from "../MetricDetailsContext";
import { IScrapMeasurement } from "../../../serverApi/IScrapMeasurement";
import { SearchBox } from "../../common/search/SearchBox";
import { DeviceWidth, useDeviceWidth } from "../../common/useDeviceWidth";
import { FiltersColumn, FiltersRow } from "../filters/FiltersRow";

export const ScrapsMovePage: React.FC = () => {
  const { setSubTitle } = usePageContext();

  const { measurements } = useMetricContext();

  const [targetMetricId, setTargetMetricId] = useState<string>(undefined);
  const [searchText, setSearchText] = useState("");

  const navigate = useNavigate();

  const { measurementId, metricId } = useParams();
  const mutation = useMoveMeasurementMutation(measurementId, metricId, () =>
    navigate(`/metrics/${targetMetricId}`),
  );

  useEffect(() => setSubTitle("Move scrap to..."), []);

  const metrics = useMetricsQuery(searchText, [MetricType.Scraps]);

  const deviceWidth = useDeviceWidth();
  const Row = deviceWidth === DeviceWidth.Small ? FiltersColumn : FiltersRow;

  return (
    <Page subTitle="Move scrap to..." actions={[]}>
      <PageSection>
        <Row>
          <SearchBox searchText={searchText} setSearchText={setSearchText} />
        </Row>
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
      </PageSection>

      {targetMetricId ? (
        <PageSection>
          <PageFormButtonContainer style={{ paddingTop: 0 }}>
            <Button
              variant="contained"
              onClick={() => {
                mutation.mutate({ targetMetricId: targetMetricId });
              }}
            >
              Move
            </Button>
          </PageFormButtonContainer>
        </PageSection>
      ) : null}

      <Scrap
        scrap={
          measurements.find((m) => m.id === measurementId) as IScrapMeasurement
        }
        hideActions={true}
      />
    </Page>
  );
};
