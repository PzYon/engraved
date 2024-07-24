import React, { useEffect, useState } from "react";
import { DialogFormButtonContainer } from "../../common/FormButtonContainer";
import { Button, FormControlLabel, styled, Switch } from "@mui/material";
import { useModifyScheduleMutation } from "../../../serverApi/reactQuery/mutations/useModifyScheduleMutation";
import { ParseableDate } from "./ParseableDate";
import { DateSelector } from "../../common/DateSelector";
import { IScheduleDefinition } from "../../../serverApi/IScheduleDefinition";
import { IParsedDate } from "./parseDate";
import { IEntity } from "../../../serverApi/IEntity";
import {
  getScheduleDefinition,
  getScheduleForUser,
} from "../../overview/scheduled/scheduleUtils";
import { IJournal } from "../../../serverApi/IJournal";
import { ServerApi } from "../../../serverApi/ServerApi";
import { useAppContext } from "../../../AppContext";
import { IEntry } from "../../../serverApi/IEntry";
import { useItemAction } from "../../common/actions/searchParamHooks";

export const EditScheduleAction: React.FC<{
  journal?: IJournal;
  entry?: IEntry;
}> = ({ journal, entry }) => {
  const [parsed, setParsed] = useState<IParsedDate>({ input: undefined });

  const [isDirty, setIsDirty] = useState(false);

  const { user } = useAppContext();

  const { closeAction } = useItemAction();

  useEffect(() => {
    getNextOccurrence().then((d) => {
      setParsed({
        date: d ? new Date(d) : null,
        input: parsed.input,
      });
    });

    async function getNextOccurrence() {
      const entity: IEntity = await (entry?.id
        ? ServerApi.getEntry(entry.id)
        : Promise.resolve(journal));

      if (!entity) {
        return null;
      }

      return getScheduleForUser(entity, user.id).nextOccurrence;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [showFullForm, setShowFullForm] = useState(!!parsed.date);

  const modifyScheduleMutation = useModifyScheduleMutation(
    journal?.id,
    entry?.id,
  );

  return (
    <Host>
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
            setParsed({ date: d, input: parsed.text });
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
    </Host>
  );

  function save() {
    const scheduleDefinition: IScheduleDefinition = getScheduleDefinition(
      parsed,
      journal?.id ?? entry?.parentId,
      entry?.id || "",
    );

    modifyScheduleMutation.mutate(scheduleDefinition);

    closeAction();
  }
};

const Host = styled("div")`
  width: 100%;
`;
