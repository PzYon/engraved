import React from "react";
import { Button, FormControlLabel, Switch } from "@mui/material";
import { ParseableDate } from "./ParseableDate";
import { DateSelector } from "../../common/DateSelector";
import { IParsedDate } from "./parseDate";
import { DialogFormButtonContainer } from "../../common/FormButtonContainer";

export const ScheduleEditForm: React.FC<{
  parsed: IParsedDate;
  isDirty: boolean;
  showFullForm: boolean;
  setShowFullForm: (show: boolean) => void;
  setParsed: (parsed: IParsedDate) => void;
  setIsDirty: (dirty: boolean) => void;
  save: () => void;
  closeAction: () => void;
}> = ({
  parsed,
  isDirty,
  showFullForm,
  setShowFullForm,
  setParsed,
  setIsDirty,
  save,
  closeAction,
}) => {
  return (
    <>
      <FormControlLabel
        label="Show full form"
        control={
          <Switch
            checked={showFullForm}
            onChange={(_, checked) => {
              setShowFullForm(checked);
            }}
          />
        }
      />
      <ParseableDate
        sx={{ marginBottom: 2 }}
        parseDateOnly={true}
        onChange={(d) => {
          setParsed(d);
          setIsDirty(!!d.date);
        }}
        onSelect={save}
      />

      {showFullForm ? (
        <DateSelector
          date={parsed.date}
          setDate={(d) => {
            setParsed({ date: d ?? undefined, input: parsed.text ?? "" });
            setIsDirty(true);
          }}
          showTime={true}
          showClear={true}
        />
      ) : null}

      <DialogFormButtonContainer sx={{ paddingTop: 0 }}>
        <Button variant="outlined" onClick={closeAction}>
          Cancel
        </Button>

        <Button variant="contained" onClick={save} disabled={!isDirty}>
          Save
        </Button>
      </DialogFormButtonContainer>
    </>
  );
};
