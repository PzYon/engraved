import React from "react";
import { FiltersColumn, FiltersRow } from "../../details/filters/FiltersRow";
import { PageJournalTypesSelector } from "./PageJournalTypesSelector";
import { DeviceWidth, useDeviceWidth } from "../useDeviceWidth";
import { PageSearchBox } from "./PageSearchBox";
import { PageSection } from "../../layout/pages/PageSection";
import { usePageContext } from "../../layout/pages/PageContext";

export const PageFilters: React.FC = () => {
  const deviceWidth = useDeviceWidth();
  const { showFilters, filterMode } = usePageContext();

  const Row = deviceWidth === DeviceWidth.Small ? FiltersColumn : FiltersRow;

  if (!showFilters) {
    return null;
  }

  return (
    <PageSection>
      <Row style={{ marginBottom: 0 }}>
        {filterMode === "both" || filterMode === "text" ? (
          <PageSearchBox />
        ) : null}

        {filterMode === "both" || filterMode === "journal-type" ? (
          <PageJournalTypesSelector />
        ) : null}
      </Row>
    </PageSection>
  );
};
