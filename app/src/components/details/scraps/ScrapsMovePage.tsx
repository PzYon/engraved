import React, { useState } from "react";
import { useParams } from "react-router";
import { SearchBox } from "../../common/search/SearchBox";
import { MetricTypeSelector } from "../../MetricTypeSelector";
import { MetricType } from "../../../serverApi/MetricType";
import { useMetricsQuery } from "../../../serverApi/reactQuery/queries/useMetricsQuery";
import { Button, List, ListItem } from "@mui/material";

export const ScrapsMovePage: React.FC = () => {
  const { metricId, measurementId } = useParams();

  const [searchText, setSearchText] = useState<string>("");
  const [metricTypes, setMetricTypes] = useState<MetricType[]>([]);

  const [targetMetricId, setTargetMetricId] = useState<string>(undefined);

  const metrics = useMetricsQuery(searchText, metricTypes);

  return (
    <div>
      <SearchBox searchText={searchText} setSearchText={setSearchText} />
      <MetricTypeSelector
        allowMultiple={true}
        metricType={metricTypes}
        onChange={(x) => setMetricTypes(x as MetricType[])}
      />
      {metrics?.length ? (
        <List>
          {metrics.map((x) => {
            return (
              <ListItem key={x.id} onClick={() => setTargetMetricId(x.id)}>
                <div key={x.id}>{x.name}</div>
              </ListItem>
            );
          })}
        </List>
      ) : null}
      {targetMetricId ? (
        <Button
          variant="contained"
          onClick={() => alert("move - create mutation")}
        >
          Move
        </Button>
      ) : null}
    </div>
  );
};
