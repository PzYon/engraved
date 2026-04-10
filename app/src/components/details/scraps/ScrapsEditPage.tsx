import React, { useState } from "react";
import { useJournalContext } from "../JournalContext";
import { useNavigate } from "react-router-dom";
import { Page } from "../../layout/pages/Page";
import { JournalPageTitle } from "../JournalPageTitle";
import { getCommonEditModeActions } from "../../overview/getCommonJournalActions";
import { EditCommonProperties } from "../edit/EditCommonProperties";
import { useEditJournalMutation } from "../../../serverApi/reactQuery/mutations/useEditJournalMutation";
import { EditPageFooterButtons } from "../../common/EditPageFooterButtons";
import { JournalType } from "../../../serverApi/JournalType";
import { ILogBookJournal } from "../../../serverApi/ILogBookJournal";
import { EditLogBookProperties } from "./EditLogBookProperties";

export const ScrapsEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { journal } = useJournalContext();

  const [name, setName] = useState(journal.name);
  const [description, setDescription] = useState(journal.description);

  const [customProps, setCustomProps] = useState({});

  const [changedTagNames, setChangedTagNames] = useState<string[]>(undefined);

  const editJournalMutation = useEditJournalMutation(journal.id);

  const disableSave =
    name === journal.name &&
    description === journal.description &&
    !changedTagNames;

  const navigateToViewPage = () => navigate("./..");

  return (
    <Page
      title={<JournalPageTitle journal={journal} />}
      subTitle="Edit"
      documentTitle={`Edit ${journal.name}`}
      actions={[
        ...getCommonEditModeActions(navigateToViewPage, save, disableSave),
      ]}
    >
      <EditCommonProperties
        journalId={journal.id}
        name={name}
        setName={setName}
        description={description}
        setDescription={setDescription}
        onChangedTags={setChangedTagNames}
      />
      {journal.type === JournalType.LogBook ? (
        <EditLogBookProperties
          journal={journal as ILogBookJournal}
          setCustomProps={setCustomProps}
        />
      ) : null}
      <EditPageFooterButtons
        onSave={save}
        disableSave={disableSave}
        onCancel={navigateToViewPage}
      />
    </Page>
  );

  async function save() {
    debugger;
    await editJournalMutation.mutateAsync({
      journal: { ...journal, name, description, ...customProps },
      tagIds: changedTagNames,
      onSuccess: navigateToViewPage,
    });
  }
};
