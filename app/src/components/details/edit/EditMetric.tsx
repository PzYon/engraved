import { IMetric } from "../../../serverApi/IMetric";
import React, { useState } from "react";
import { Button, FormControl, styled, TextField } from "@mui/material";
import { translations } from "../../../i18n/translations";
import { ServerApi } from "../../../serverApi/ServerApi";
import { useAppContext } from "../../../AppContext";
import { MetricAttributesEditor } from "./MetricAttributesEditor";
import { IMetricAttributes } from "../../../serverApi/IMetricAttributes";

export const EditMetric: React.FC<{
  metric: IMetric;
  onSaved: () => Promise<unknown>;
}> = ({ metric, onSaved }) => {
  const [attributes, setAttributes] = useState<IMetricAttributes>(
    metric.attributes
  );

  const [name, setName] = useState(metric.name);
  const [description, setDescription] = useState(metric.description);

  const { setAppAlert } = useAppContext();

  return (
    <>
      <FormControl sx={{ width: "100%" }}>
        <TextField
          value={name}
          onChange={(event) => setName(event.target.value)}
          label={translations.label_metricName}
          margin={"normal"}
        />
        <TextField
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          multiline={true}
          label={"Description"}
          margin={"normal"}
        />
        <MetricAttributesEditor
          attributes={attributes}
          setAttributes={setAttributes}
        />
      </FormControl>
      <ButtonContainer>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => {
            ServerApi.editMetric(
              metric.id,
              name,
              description,
              metric.notes,
              attributes
            )
              .then(() => {
                setAppAlert({
                  title: "Saved metric",
                  type: "success",
                });

                onSaved();
              })
              .catch((e) => {
                setAppAlert({
                  title: "Failed to edit metric",
                  message: e.message,
                  type: "error",
                });
              });
          }}
        >
          {translations.save}
        </Button>
      </ButtonContainer>
    </>
  );
};

const ButtonContainer = styled("div")`
  margin-top: 15px;
  text-align: right;
`;
