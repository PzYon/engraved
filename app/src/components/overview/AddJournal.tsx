import { Button, FormControl, TextField } from "@mui/material";
import React, { useState } from "react";
import { translations } from "../../i18n/translations";
import { JournalTypeSelector } from "../JournalTypeSelector";
import { JournalType } from "../../serverApi/JournalType";
import { useNavigate } from "react-router-dom";
import { ICommandResult } from "../../serverApi/ICommandResult";
import { useAddJournalMutation } from "../../serverApi/reactQuery/mutations/useAddJournalMutation";
import { PageFormButtonContainer } from "../common/FormButtonContainer";
import { PageSection } from "../layout/pages/PageSection";

export const AddJournal: React.FC = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [journalType, setJournalType] = useState(JournalType.Scraps);

  const navigate = useNavigate();

  const addJournalMutation = useAddJournalMutation(
    name,
    description,
    journalType,
    async (result: ICommandResult) => {
      navigate(`/journals/${result.entityId}/`);
    },
  );

  return (
    <>
      <PageSection>
        <FormControl sx={{ width: "100%" }}>
          <TextField
            id={Math.random().toString()}
            value={name}
            onChange={(event) => setName(event.target.value)}
            required={true}
            label={translations.label_journalName}
            margin={"normal"}
          />
          <JournalTypeSelector
            journalType={journalType}
            onChange={(type) => setJournalType(type as JournalType)}
          />
          <TextField
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            multiline={true}
            label={translations.label_journalDescription}
            margin={"normal"}
          />
        </FormControl>
      </PageSection>

      <PageSection>
        <PageFormButtonContainer style={{ paddingTop: 0 }}>
          <Button variant="outlined" onClick={() => navigate("/journals")}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => addJournalMutation.mutate()}
            disabled={!name}
          >
            {translations.create}
          </Button>
        </PageFormButtonContainer>
      </PageSection>
    </>
  );
};
