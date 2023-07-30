import React from "react";
import { FiltersColumn, FiltersRow } from "../../details/filters/FiltersRow";
import { PageMetricTypesSelector } from "./PageMetricTypesSelector";
import { DeviceWidth, useDeviceWidth } from "../useDeviceWidth";
import { PageSearchBox } from "./PageSearchBox";
import { PageSection } from "../../layout/pages/PageSection";

export const PageFilters: React.FC = () => {
  const deviceWidth = useDeviceWidth();

  const Row = deviceWidth === DeviceWidth.Small ? FiltersColumn : FiltersRow;

  return (
    <PageSection>
      <Row style={{ marginBottom: 0 }}>
        <PageSearchBox />
        <PageMetricTypesSelector />
      </Row>
    </PageSection>
  );
};
