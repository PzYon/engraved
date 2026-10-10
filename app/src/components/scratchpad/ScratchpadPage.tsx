import React, { useState } from "react";
import { Button, styled, Typography } from "@mui/material";
import Assignment from "@mui/icons-material/Assignment";
import DeleteSweepOutlined from "@mui/icons-material/DeleteSweepOutlined";
import { Page } from "../layout/pages/Page";
import { PageTitle } from "../layout/pages/PageTitle";
import { PageSection } from "../layout/pages/PageSection";
import { Icon } from "../common/Icon";
import { IconStyle } from "../common/IconStyle";
import { RichTextEditor } from "../common/RichTextEditor";
import { getTogglePlainTextAction } from "../common/formattingActions";
import { ActionFactory } from "../common/actions/ActionFactory";
import { IAction } from "../common/actions/IAction";
import { DialogFormButtonContainer } from "../common/FormButtonContainer";
import { Markdown } from "../details/scraps/markdown/Markdown";
import { useDialogContext } from "../layout/dialogs/DialogContext";
import { useAppContext } from "../../AppContext";
import { translations } from "../../i18n/translations";
import { useScratchpadSession } from "./useScratchpadSession";
import { ScratchpadStatus } from "./ScratchpadSession";
import { ScratchpadConflictDialog } from "./ScratchpadConflictDialog";

const statusLabels: Record<ScratchpadStatus, string> = {
  loading: "",
  saved: translations.scratchpad_status_saved,
  unsaved: translations.scratchpad_status_unsaved,
  saving: translations.scratchpad_status_saving,
  failed: translations.scratchpad_status_failed,
};

export const ScratchpadPage: React.FC = () => {
  const { setAppAlert } = useAppContext();
  const { renderDialog } = useDialogContext();
  const { session, state } = useScratchpadSession();

  // Edited as plain text, which keeps every character as it was typed, and
  // shown as markdown only to read it.
  const [isPlainText, setIsPlainText] = useState(true);

  const actions: IAction[] = [
    getTogglePlainTextAction(isPlainText, () => setIsPlainText(!isPlainText)),
    ActionFactory.copyValueToClipboard(state.content, setAppAlert),
    {
      key: "clear-scratchpad",
      label: translations.scratchpad_clear,
      icon: <DeleteSweepOutlined fontSize="small" />,
      isDisabled: !state.content,
      onClick: () =>
        renderDialog({
          title: translations.scratchpad_clear_title,
          render: (closeDialog) => (
            <>
              <Typography>{translations.scratchpad_clear_question}</Typography>
              <DialogFormButtonContainer>
                <Button variant="outlined" onClick={closeDialog}>
                  {translations.cancel}
                </Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    session.clear();
                    closeDialog();
                  }}
                >
                  {translations.scratchpad_clear}
                </Button>
              </DialogFormButtonContainer>
            </>
          ),
        }),
    },
  ];

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
      actions={actions}
      tabs={[]}
    >
      <PageSection>
        {state.status === "loading" ? null : (
          <>
            {isPlainText ? (
              <RichTextEditor
                key={state.revision}
                initialValue={state.content}
                setValue={(value) => session.edit(value)}
                initialIsPlainText={true}
                autoFocus={true}
                placeholder={translations.scratchpad_placeholder}
              />
            ) : (
              <Markdown value={state.content} />
            )}
            <Status variant="caption" data-testid="scratchpad-status">
              {statusLabels[state.status]}
            </Status>
          </>
        )}
      </PageSection>

      <ScratchpadConflictDialog
        conflict={state.conflict}
        keepMine={() => session.keepMine()}
        takeTheirs={() => session.takeTheirs()}
      />
    </Page>
  );
};

const Status = styled(Typography)`
  display: block;
  margin-top: ${(p) => p.theme.spacing(1)};
  color: ${(p) => p.theme.palette.text.secondary};
`;
