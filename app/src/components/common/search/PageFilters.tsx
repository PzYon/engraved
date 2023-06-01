import { SearchBox } from "./SearchBox";
import React from "react";
import { PageSection } from "../../layout/pages/PageSection";
import { FiltersRow } from "../../details/filters/FiltersRow";
import { PageMetricTypesSelector } from "./PageMetricTypesSelector";

export const PageFilters: React.FC = () => {
  return (
    <PageSection>
      <FiltersRow style={{ marginBottom: 0 }}>
        <SearchBox />
        <PageMetricTypesSelector />
      </FiltersRow>
    </PageSection>
  );
};
