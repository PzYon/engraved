import { DateFilters } from "./DateFilters";
import { JournalTypeFactory } from "../../../journalTypes/JournalTypeFactory";
import { GroupByTimeSelector } from "../chart/grouping/GroupByTimeSelector";
import { GroupByAttributeSelector } from "../chart/grouping/GroupByAttributeSelector";
import {
  ChartTypeSelector,
  MyChartType,
} from "../chart/grouping/ChartTypeSelector";
import React from "react";
import { GroupByTime } from "../chart/consolidation/GroupByTime";
import { IJournal } from "../../../serverApi/IJournal";
import { AttributeFilters } from "./AttributeFilters";
import { translations } from "../../../i18n/translations";
import { SearchTextFilter } from "./SearchTextFilter";
import { PageSection } from "../../layout/pages/PageSection";
import { FiltersRow } from "./FiltersRow";
import { DateFilterConfig } from "../edit/IJournalUiSettings";

export const EntryFilters: React.FC<{
  journal: IJournal;
  groupByTime: GroupByTime;
  setGroupByTime: (g: GroupByTime) => void;
  attributeKey: string;
  setAttributeKey: (k: string) => void;
  chartType: MyChartType;
  setChartType: (t: MyChartType) => void;
  dateFilter: DateFilterConfig;
}> = ({
  journal,
  groupByTime,
  setGroupByTime,
  attributeKey,
  setAttributeKey,
  chartType,
  setChartType,
  dateFilter,
}) => {
  return (
    <>
      <PageSection title="Freetext search">
        <FiltersRow>
          <SearchTextFilter />
        </FiltersRow>
      </PageSection>

      <PageSection title="Date filters">
        <FiltersRow>
          <DateFilters config={dateFilter} />
        </FiltersRow>
      </PageSection>

      {!Object.keys(journal.attributes || {}).length ? null : (
        <PageSection title="Attribute filters">
          <FiltersRow>
            <AttributeFilters />
          </FiltersRow>
        </PageSection>
      )}

      <PageSection title="Grouping">
        <FiltersRow>
          {JournalTypeFactory.create(journal.type).isGroupable ? (
            <GroupByTimeSelector
              groupByTime={groupByTime}
              onChange={setGroupByTime}
            />
          ) : null}
          {Object.keys(journal.attributes).length > 0 ? (
            <GroupByAttributeSelector
              attributes={journal.attributes}
              selectedAttributeKey={attributeKey}
              onChange={setAttributeKey}
              label={translations.label_groupBy_attribute}
            />
          ) : null}
          <ChartTypeSelector chartType={chartType} onChange={setChartType} />
        </FiltersRow>
      </PageSection>
    </>
  );
};
