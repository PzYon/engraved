import { Button, FormControl, TextField } from "@mui/material";
import React, { useState } from "react";
import { translations } from "../../i18n/translations";
import { Section } from "../layout/Section";
import { MetricTypeSelector } from "../MetricTypeSelector";
import { MetricType } from "../../serverApi/MetricType";
import { ServerApi } from "../../serverApi/ServerApi";
import { useAppContext } from "../../AppContext";
import { useNavigate } from "react-router-dom";

export const AddMetric: React.FC<{ onAdded: () => void }> = ({ onAdded }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [metricType, setMetricType] = useState(MetricType.Counter);

  const { setAppAlert } = useAppContext();

  const navigate = useNavigate();

  return (
    <Section>
      <FormControl>
        <TextField
          value={name}
          onChange={(event) => setName(event.target.value)}
          required={true}
          label={translations.label_metricName}
          margin={"normal"}
        />
        <TextField
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          multiline={true}
          label={translations.label_metricDescription}
          margin={"normal"}
        />
        <MetricTypeSelector metricType={metricType} onChange={setMetricType} />
        <Button
          variant="outlined"
          onClick={() => {
            const key = createUuidV4();
            ServerApi.addMetric(key, name, description, metricType)
              .then(async () => {
                await onAdded();
                navigate(`/metrics/${key}`);

                setAppAlert({
                  title: `Added metric ${name}`,
                  type: "success",
                });
              })
              .catch((e) => {
                setAppAlert({
                  title: "Failed to add metric",
                  message: e.message,
                  type: "error",
                });
              });
          }}
        >
          {translations.create}
        </Button>
      </FormControl>
    </Section>
  );
};

// https://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid
function createUuidV4() {
  let d = new Date().getTime(); //Timestamp
  let d2 =
    (typeof performance !== "undefined" &&
      performance.now &&
      performance.now() * 1000) ||
    0; //Time in microseconds since page-load or 0 if unsupported
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    let r = Math.random() * 16; //random number between 0 and 16
    if (d > 0) {
      //Use timestamp until depleted
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      //Use microseconds since page-load if supported
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}
