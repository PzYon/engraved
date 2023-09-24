import React, { useEffect, useMemo, useState } from "react";
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
import { Route, Routes, useNavigate } from "react-router-dom";
import { DeleteMeasurementLauncher } from "../edit/DeleteMeasurementLauncher";
import { ScrapsMetricType } from "../../../metricTypes/ScrapsMetricType";
import { GenericEmptyPlaceholder } from "../../common/search/GenericEmptyPlaceholder";
import { useHotkeys } from "react-hotkeys-hook";
import { ScrapWrapperCollection } from "./ScrapWrapperCollection";

import { ActionFactory } from "../../common/actions/ActionFactory";

export const ScrapsViewPage: React.FC = () => {
  const navigate = useNavigate();

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

  const keyToken = useMemo(() => {
    return Math.random();
  }, [scraps]);

  const collection = useMemo(() => new ScrapWrapperCollection(), [scraps]);

  // alt+s (save) is handled by code mirror resp. list

  useHotkeys("alt+up", () => {
    collection.moveFocusUp();
  });

  useHotkeys("alt+down", () => {
    collection.moveFocusDown();
  });

  useHotkeys("alt+e", (keyboardEvent) => {
    keyboardEvent.preventDefault();
    collection.setEditMode();
  });

  useHotkeys("alt+d", (keyboardEvent) => {
    keyboardEvent.preventDefault();
    navigate(`measurements/${collection.current.internalObj.id}/delete`);
  });

  const addNewMarkdownAction = getAddNewAction("markdown");
  const addNewListAction = getAddNewAction("list");

  useHotkeys("alt+m", (keyboardEvent) => {
    keyboardEvent.preventDefault();
    addNewMarkdownAction.onClick();
  });

  useHotkeys("alt+l", (keyboardEvent) => {
    keyboardEvent.preventDefault();
    addNewListAction.onClick();
  });

  if (!scraps || !metric) {
    return;
  }

  return (
    <Page
      title={<MetricPageTitle metric={metric} />}
      documentTitle={metric.name}
      actions={[
        addNewMarkdownAction,
        addNewListAction,
        null,
        ...getCommonActions(metric),
      ]}
    >
      {newScrap ? <Scrap key="new" scrap={newScrap} /> : null}

      {scraps.length
        ? (scraps as IScrapMeasurement[]).map((scrap, i) => (
            <Scrap
              key={scrap.id + keyToken}
              onClick={() => collection.setFocus(i)}
              addScrapWrapper={(scrapWrapper) =>
                collection.add(scrap.id, scrapWrapper)
              }
              scrap={scrap}
              index={i}
            />
          ))
        : null}

      {!scraps.length && !newScrap ? (
        <GenericEmptyPlaceholder
          icon={SelfImprovementOutlined}
          message={"Nothing here..."}
        />
      ) : null}

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
