import React, { useEffect, useState } from "react";
import { Page } from "../../layout/pages/Page";
import { Button } from "@mui/material";
import { useMoveEntryMutation } from "../../../serverApi/reactQuery/mutations/useMoveEntryMutation";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import { usePageContext } from "../../layout/pages/PageContext";
import { PageSection } from "../../layout/pages/PageSection";
import { PageFormButtonContainer } from "../../common/FormButtonContainer";
import { Scrap } from "./Scrap";
import { useJournalContext } from "../JournalDetailsContext";
import { IScrapEntry } from "../../../serverApi/IScrapEntry";
import { JournalSelector } from "../../common/JournalSelector";

export const ScrapsMovePage: React.FC = () => {
  const navigate = useNavigate();
  const { entryId, journalId } = useParams();

  const { setSubTitle } = usePageContext();

  const { entries } = useJournalContext();
  const entry = entries.find((m) => m.id === entryId) as IScrapEntry;

  const [targetJournalId, setTargetJournalId] = useState<string>(undefined);

  const mutation = useMoveEntryMutation(entryId, journalId, () =>
    navigate(`/journals/${targetJournalId}`),
  );

  useEffect(() => setSubTitle("Move scrap to..."), []);

  if (!entry) {
    return null;
  }

  return (
    <Page subTitle="Move scrap to..." actions={[]}>
      <PageSection>
        <JournalSelector
          label={"Move to journal"}
          onChange={(journal) => setTargetJournalId(journal?.id)}
        />
        <PageFormButtonContainer>
          <Button
            disabled={!targetJournalId}
            variant="contained"
            onClick={() => {
              mutation.mutate({ targetJournalId: targetJournalId });
            }}
          >
            Move
          </Button>
        </PageFormButtonContainer>
      </PageSection>

      <Scrap scrap={entry} hideActions={true} />
    </Page>
  );
};
