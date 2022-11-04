import { IMetric } from "../../../serverApi/IMetric";
import React, { useState } from "react";
import { Button, FormControl, styled, TextField } from "@mui/material";
import { translations } from "../../../i18n/translations";
import { ServerApi } from "../../../serverApi/ServerApi";
import { useAppContext } from "../../../AppContext";
import { MetricAttributesEditor } from "./MetricAttributesEditor";
import { IMetricAttributes } from "../../../serverApi/IMetricAttributes";
import { EditThresholds } from "../thresholds/EditThresholds";
import { DetailsSection } from "../../layout/DetailsSection";
import { IMetricThresholds } from "../../../serverApi/IMetricThresholds";

export const EditMetric: React.FC<{
  metric: IMetric;
  onSaved: () => Promise<unknown>;
}> = ({ metric, onSaved }) => {
  const [attributes, setAttributes] = useState<IMetricAttributes>(
    metric.attributes
  );

  const [thresholds, setThresholds] = useState<IMetricThresholds>(
    metric.thresholds ?? {}
  );

  const [name, setName] = useState(metric.name);
  const [description, setDescription] = useState(metric.description);

  const { setAppAlert } = useAppContext();

  return (
    <>
      <DetailsSection title={"Properties"}>
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
        </FormControl>
      </DetailsSection>
      <DetailsSection title={"Attributes"}>
        <MetricAttributesEditor
          attributes={attributes}
          setAttributes={setAttributes}
        />
      </DetailsSection>
      <DetailsSection title={"Thresholds"}>
        <EditThresholds metric={metric} onChange={setThresholds} />
      </DetailsSection>
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
              attributes,
              thresholds
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
  margin-top: ${(p) => p.theme.spacing(2)};
  text-align: right;
`;
