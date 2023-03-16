import React, { useEffect, useState } from "react";
import { Scrap } from "./Scrap";
import { AddOutlined } from "@mui/icons-material";
import { IconButtonWrapper } from "../../../common/IconButtonWrapper";
import { useMetricContext } from "../../MetricDetailsContext";
import { IMeasurement } from "../../../../serverApi/IMeasurement";
import { MetricPageTitle } from "../../MetricPageTitle";
import { getCommonActions } from "../../../overview/getCommonActions";
import { Page } from "../../../layout/pages/Page";

export const Scraps: React.FC = () => {
  const {
    metric,
    measurements: scraps,
    setDateConditions,
  } = useMetricContext();

  const [newScrap, setNewScrap] = useState<IMeasurement>(null);

  useEffect(() => {
    // we need to set date conditions in order for data to be loaded
    setDateConditions({});
  }, []);

  useEffect(() => {
    setNewScrap(null);
  }, [scraps]);

  if (!scraps) {
    return;
  }

  return (
    <Page
      title={<MetricPageTitle metric={metric} />}
      documentTitle={metric.name}
      actions={getCommonActions(metric)}
    >
      {newScrap ? <Scrap scrap={newScrap} /> : null}

      {scraps.map((s) => (
        <Scrap key={s.id} scrap={s} />
      ))}

      <IconButtonWrapper
        action={{
          key: "add-scrap",
          label: "Add new",
          icon: <AddOutlined fontSize="small" />,
          onClick: () => {
            setNewScrap({
              id: null,
              dateTime: null,
              notes: "",
              metricId: metric.id,
            });
          },
        }}
      />
    </Page>
  );
};
