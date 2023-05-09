import React, { useState } from "react";
import { Page } from "../layout/pages/Page";
import { PageTitle } from "../layout/pages/PageTitle";
import { Icon, IconStyle } from "../common/Icon";
import { SearchOutlined } from "@mui/icons-material";
import { TextField } from "@mui/material";
import { ServerApi } from "../../serverApi/ServerApi";
import { IMeasurement } from "../../serverApi/IMeasurement";
import { PageSection } from "../layout/pages/PageSection";

export const SearchPage: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [measurements, setMeasurements] = useState([]);

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
        onKeyUp={(e) => {
          if (e.key === "Enter") {
            ServerApi.searchMeasurements(searchText).then((m) =>
              setMeasurements(m)
            );
          }
        }}
      />
      {measurements.map((m) => (
        <PageSection key={m.id}>{renderActivity(m)}</PageSection>
      ))}
    </Page>
  );

  function renderActivity(measurement: IMeasurement) {
    return (
      <div>
        <div>Notes: {measurement.notes}</div>
      </div>
    );

    //return MetricTypeFactory.create(metric.type).getActivity(
    //  metric,
    //  measurement
    //);
  }
};
