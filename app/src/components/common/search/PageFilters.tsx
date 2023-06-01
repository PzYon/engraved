import { SearchBox } from "./SearchBox";
import React from "react";
import { PageSection } from "../../layout/pages/PageSection";
import { FiltersRow } from "../../details/filters/FiltersRow";
import { PageMetricTypesSelector } from "./PageMetricTypesSelector";
import { DeviceWidth, useDeviceWidth } from "../useDeviceWidth";

export const PageFilters: React.FC = () => {
  const deviceWidth = useDeviceWidth();

  const flexDirection = deviceWidth === DeviceWidth.Small ? "column" : "row";

  return (
    <PageSection>
      <FiltersRow style={{ marginBottom: 0, flexDirection: flexDirection }}>
        <SearchBox />
        <PageMetricTypesSelector />
      </FiltersRow>
    </PageSection>
  );
};
