import React, { useEffect, useState } from "react";
import { Scrap } from "./Scrap";
import { AddOutlined } from "@mui/icons-material";
import { IconButtonWrapper } from "../../../common/IconButtonWrapper";
import { useMetricContext } from "../../MetricDetailsContext";
import { IMeasurement } from "../../../../serverApi/IMeasurement";

// todo:
// - how can i delete a measurement?
// - do note update/save if nothing has changed

export const Scraps: React.FC = () => {
  const {
    metric,
    measurements: scraps,
    setDateConditions,
  } = useMetricContext();

  const [newScrap, setNewScrap] = useState<IMeasurement>(null);

  useEffect(() => {
    setDateConditions({});
  }, []);

  if (!scraps) {
    return;
  }

  return (
    <>
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
    </>
  );
};
