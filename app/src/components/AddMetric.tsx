import { Button, TextField } from "@mui/material";
import React, { useState } from "react";
import { translations } from "../i18n/translations";

export const AddMetric: React.FC = () => {
  const [name, setName] = useState("");

  return (
    <>
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
    </>
  );
};
