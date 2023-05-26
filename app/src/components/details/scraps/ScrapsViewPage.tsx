import React, { useEffect, useState } from "react";
import { Scrap } from "./Scrap";
import {
  CheckBoxOutlined,
  FormatAlignLeftOutlined,
  SelfImprovementOutlined,
} from "@mui/icons-material";
import { useMetricContext } from "../MetricDetailsContext";
import { MetricPageTitle } from "../MetricPageTitle";
import { getCommonActions } from "../../overview/getCommonActions";
import { Page } from "../../layout/pages/Page";
import {
  IScrapMeasurement,
  ScrapType,
} from "../../../serverApi/IScrapMeasurement";
import { Route, Routes } from "react-router-dom";
import { DeleteMeasurementLauncher } from "../edit/DeleteMeasurementLauncher";
import { PageSection } from "../../layout/pages/PageSection";
import { ScrapsMetricType } from "../../../metricTypes/ScrapsMetricType";
import { GenericEmptyPlaceholder } from "../../common/search/GenericEmptyPlaceholder";

export const ScrapsViewPage: React.FC = () => {
  const {
    metric,
    measurements: scraps,
    setDateConditions,
  } = useMetricContext();

  const [newScrap, setNewScrap] = useState<IScrapMeasurement>(null);

  useEffect(() => {
    // we need to set date conditions in order for data to be loaded
    setDateConditions({});
  }, []);

  useEffect(() => {
    setNewScrap(null);
  }, [scraps]);

  if (!scraps || !metric) {
    return;
  }

  return (
    <Page
      title={<MetricPageTitle metric={metric} />}
      documentTitle={metric.name}
      actions={[
        getAddNewAction("markdown"),
        getAddNewAction("list"),
        null,
        ...getCommonActions(metric),
      ]}
    >
      {newScrap ? (
        <PageSection key="new">
          <Scrap scrap={newScrap} />
        </PageSection>
      ) : null}

      {scraps.length ? (
        (scraps as IScrapMeasurement[]).map((s) => (
          <PageSection key={s.id}>
            <Scrap scrap={s} />
          </PageSection>
        ))
      ) : (
        <GenericEmptyPlaceholder
          icon={SelfImprovementOutlined}
          message={"Nothing here..."}
        />
      )}

      <Routes>
        <Route
          path="/measurements/:measurementId/delete"
          element={<DeleteMeasurementLauncher metric={metric} />}
        />
      </Routes>
    </Page>
  );

  function getAddNewAction(type: "markdown" | "list") {
    const isMarkdown = type === "markdown";

    return {
      key: "add-scrap-" + type,
      label: "Add " + type,
      icon: isMarkdown ? <MarkdownScrapIcon /> : <ListScrapIcon />,
      onClick: () => {
        setNewScrap(
          ScrapsMetricType.createBlank(
            metric.id,
            isMarkdown ? ScrapType.Markdown : ScrapType.List
          )
        );
      },
    };
  }
};

export const MarkdownScrapIcon = () => {
  return <FormatAlignLeftOutlined fontSize="small" />;
};

export const ListScrapIcon = () => {
  return <CheckBoxOutlined fontSize="small" />;
};
