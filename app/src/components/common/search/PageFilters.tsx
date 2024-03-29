import React, { useEffect } from "react";
import { FiltersColumn, FiltersRow } from "../../details/filters/FiltersRow";
import { PageJournalTypesSelector } from "./PageJournalTypesSelector";
import { DeviceWidth, useDeviceWidth } from "../useDeviceWidth";
import { PageSearchBox } from "./PageSearchBox";
import { PageSection } from "../../layout/pages/PageSection";
import { FilterMode, usePageContext } from "../../layout/pages/PageContext";

export const PageFilters: React.FC = () => {
  const deviceWidth = useDeviceWidth();
  const { showFilters, filterMode, setSearchText, setJournalTypes } =
    usePageContext();

  useEffect(() => {
    return () => {
      setSearchText("");
      setJournalTypes([]);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const Row = deviceWidth === DeviceWidth.Small ? FiltersColumn : FiltersRow;

  if (!showFilters) {
    return null;
  }

  return (
    <PageSection>
      <Row style={{ marginBottom: 0 }}>
        {filterMode & FilterMode.Text ? <PageSearchBox /> : null}

        {filterMode & FilterMode.JournalType ? (
          <PageJournalTypesSelector />
        ) : null}
      </Row>
    </PageSection>
  );
};
