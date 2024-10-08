import React, { useState } from "react";
import { useJournalContext } from "../JournalContext";
import { useNavigate } from "react-router-dom";
import { Page } from "../../layout/pages/Page";
import { JournalPageTitle } from "../JournalPageTitle";
import { getCommonEditModeActions } from "../../overview/getCommonJournalActions";
import { EditCommonProperties } from "../edit/EditCommonProperties";
import { useEditJournalMutation } from "../../../serverApi/reactQuery/mutations/useEditJournalMutation";
import { EditPageFooterButtons } from "../../common/EditPageFooterButtons";

export const ScrapsEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { journal } = useJournalContext();

  const [name, setName] = useState(journal.name);
  const [description, setDescription] = useState(journal.description);

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
      <EditPageFooterButtons
        onSave={save}
        disableSave={disableSave}
        onCancel={navigateToViewPage}
      />
    </Page>
  );

  async function save() {
    await editJournalMutation.mutateAsync({
      journal: { ...journal, name, description },
      tagIds: changedTagNames,
      onSuccess: navigateToViewPage,
    });
  }
};
