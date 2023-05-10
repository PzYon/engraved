import React, { useState } from "react";
import { Page } from "../layout/pages/Page";
import { PageTitle } from "../layout/pages/PageTitle";
import { Icon, IconStyle } from "../common/Icon";
import { SearchOutlined } from "@mui/icons-material";
import { TextField } from "@mui/material";
import { IMeasurement } from "../../serverApi/IMeasurement";
import { PageSection } from "../layout/pages/PageSection";
import { useActivitiesQuery } from "../../serverApi/reactQuery/queries/useActivitiesQuery";
import { MetricTypeFactory } from "../../metricTypes/MetricTypeFactory";

export const SearchPage: React.FC = () => {
  const [searchText, setSearchText] = useState("");

  const activities = useActivitiesQuery(searchText);

  if (!activities) {
    return null;
  }

  return (
    <Page
      title={
        <PageTitle
          title={"Search"}
          icon={
            <Icon style={IconStyle.PageTitle}>
              <SearchOutlined />
            </Icon>
          }
        />
      }
      actions={[]}
    >
      <TextField
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
      {activities.measurements.map((m) => (
        <PageSection key={m.id}>{renderActivity(m)}</PageSection>
      ))}
    </Page>
  );

  // copied from <Activities />

  function renderActivity(measurement: IMeasurement) {
    const metric = activities.metrics.find(
      (a) => a.id === measurement.metricId
    );

    return MetricTypeFactory.create(metric.type).getActivity(
      metric,
      measurement
    );
  }
};
