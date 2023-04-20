import { FormControl, TextField } from "@mui/material";
import { translations } from "../../../i18n/translations";
import { PageSection } from "../../layout/pages/PageSection";
import React from "react";

export const EditCommonProperties: React.FC<{
  name: string;
  setName: (name: string) => void;
  description: string;
  setDescription: (description: string) => void;
}> = ({ name, setName, description, setDescription }) => {
  return (
    <PageSection title={"Properties"}>
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
    </PageSection>
  );
};
