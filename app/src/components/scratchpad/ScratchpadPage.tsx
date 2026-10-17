import React, { useState } from "react";
import { Typography } from "@mui/material";
import Assignment from "@mui/icons-material/Assignment";
import DeleteOutlined from "@mui/icons-material/DeleteOutlined";
import { Page } from "../layout/pages/Page";
import { PageTitle } from "../layout/pages/PageTitle";
import { PageSection } from "../layout/pages/PageSection";
import { Icon } from "../common/Icon";
import { IconStyle } from "../common/IconStyle";
import { RichTextEditor } from "../common/RichTextEditor";
import { ActionFactory } from "../common/actions/ActionFactory";
import { IAction } from "../common/actions/IAction";
import { DeleteButtons } from "../common/DeleteButtons";
import { ListItemFooterRow } from "../overview/ListItemFooterRow";
import { Markdown } from "../details/scraps/markdown/Markdown";
import { useDialogContext } from "../layout/dialogs/DialogContext";
import { useAppContext } from "../../AppContext";
import { translations } from "../../i18n/translations";
import { useScratchpad } from "./useScratchpad";

export const ScratchpadPage: React.FC = () => {
  const { setAppAlert } = useAppContext();
  const { renderDialog } = useDialogContext();
  const { isLoaded, content, edit, save, reset } = useScratchpad();

  // Until the user picks a mode, an empty scratchpad is edited and any other
  // one viewed. Deciding this only once would go by what was cached, which can
  // be outdated.
  const [pickedEditMode, setIsEditMode] = useState<boolean>();
  const isEditMode = pickedEditMode ?? !content.trim();

  const [editorKey, setEditorKey] = useState(0);

  const copyAction = ActionFactory.copyValueToClipboard(content, setAppAlert);

  const deleteAction: IAction = {
    key: "delete",
    label: "Delete",
    icon: <DeleteOutlined fontSize="small" />,
    onClick: () =>
      renderDialog({
        title: "Are you sure?",
        render: (closeDialog) => (
          <>
            <Typography>
              Do you really want to delete everything in your scratchpad?
            </Typography>
            <DeleteButtons
              entityType="entry"
              onCancel={closeDialog}
              onDelete={() => {
                reset();
                setIsEditMode(true);
                // the editor only takes its content when it is created
                setEditorKey(editorKey + 1);
                closeDialog();
              }}
            />
          </>
        ),
      }),
  };

  return (
    <Page
      documentTitle={translations.scratchpad_title}
      title={
        <PageTitle
          title={translations.scratchpad_title}
          icon={
            <Icon style={IconStyle.Large}>
              <Assignment fontSize="small" />
            </Icon>
          }
        />
      }
      actions={[]}
      tabs={[]}
    >
      {isLoaded ? (
        <PageSection>
          <div
            onClick={(e) => {
              if (e.detail === 2) {
                setIsEditMode(true);
              }
            }}
          >
            {isEditMode ? (
              <RichTextEditor
                key={editorKey}
                initialValue={content}
                setValue={(value) => {
                  setIsEditMode(true);
                  edit(value);
                }}
                onBlur={save}
                autoFocus={true}
                showFormattingOptions={true}
              />
            ) : (
              <Markdown value={content} />
            )}
            <ListItemFooterRow
              properties={[]}
              hasFocus={true}
              actions={
                isEditMode
                  ? [
                      copyAction,
                      ActionFactory.save(
                        async () => {
                          save();
                          setIsEditMode(false);
                        },
                        false,
                        true,
                      ),
                      deleteAction,
                    ]
                  : [
                      copyAction,
                      ActionFactory.editScrap(() => setIsEditMode(true), true),
                      deleteAction,
                    ]
              }
            />
          </div>
        </PageSection>
      ) : null}
    </Page>
  );
};
