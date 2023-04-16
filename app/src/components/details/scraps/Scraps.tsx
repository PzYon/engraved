import React, { useEffect, useState } from "react";
import { Scrap } from "./Scrap";
import { AddOutlined } from "@mui/icons-material";
import { useMetricContext } from "../MetricDetailsContext";
import { MetricPageTitle } from "../MetricPageTitle";
import { getCommonActions } from "../../overview/getCommonActions";
import { Page } from "../../layout/pages/Page";
import { IScrapMeasurement } from "../../../serverApi/IScrapMeasurement";
import { Route, Routes } from "react-router-dom";
import { DeleteMeasurementLauncher } from "../edit/DeleteMeasurementLauncher";
import { DetailsSection } from "../../layout/DetailsSection";

export const Scraps: React.FC = () => {
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
      actions={[getAddNewAction(), ...getCommonActions(metric)]}
    >
      {newScrap ? (
        <DetailsSection key="new">
          <Scrap scrap={newScrap} />
        </DetailsSection>
      ) : null}

      {(scraps as IScrapMeasurement[]).map((s) => (
        <DetailsSection key={s.id}>
          <Scrap scrap={s} />
        </DetailsSection>
      ))}

      <Routes>
        <Route
          path="/measurements/:measurementId/delete"
          element={<DeleteMeasurementLauncher metric={metric} />}
        />
      </Routes>
    </Page>
  );

  function getAddNewAction() {
    return {
      key: "add-scrap",
      label: "Add new",
      icon: <AddOutlined fontSize="small" />,
      onClick: () => {
        setNewScrap({
          id: null,
          dateTime: null,
          notes: "",
          title: "",
          metricId: metric.id,
        });
      },
    };
  }
};
