import { Button, FormControl, TextField } from "@mui/material";
import React, { useState } from "react";
import { translations } from "../i18n/translations";
import { Section } from "./layout/Section";

export const AddMetric: React.FC = () => {
  const [name, setName] = useState("");

  return (
    <Section>
      <FormControl>
        <TextField
          id="outlined-basic"
          label={translations.label_metricName}
          variant="outlined"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <Button
          variant="contained"
          onClick={() => {
            alert("Will create " + name);
          }}
        >
          {translations.create}
        </Button>
      </FormControl>
    </Section>
  );
};
