import { SearchBox } from "./SearchBox";
import React from "react";
import { PageSection } from "../../layout/pages/PageSection";
import { FiltersRow, FiltersRowColumn } from "../../details/filters/FiltersRow";
import { PageMetricTypesSelector } from "./PageMetricTypesSelector";
import { DeviceWidth, useDeviceWidth } from "../useDeviceWidth";

export const PageFilters: React.FC = () => {
  const deviceWidth = useDeviceWidth();

  const Row = deviceWidth === DeviceWidth.Small ? FiltersRowColumn : FiltersRow;

  return (
    <PageSection>
      <Row style={{ marginBottom: 0 }}>
        <SearchBox />
        <PageMetricTypesSelector />
      </Row>
    </PageSection>
  );
};
