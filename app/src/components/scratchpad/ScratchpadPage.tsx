import React, { useState } from "react";
import Assignment from "@mui/icons-material/Assignment";
import { Page } from "../layout/pages/Page";
import { PageTitle } from "../layout/pages/PageTitle";
import { PageSection } from "../layout/pages/PageSection";
import { Icon } from "../common/Icon";
import { IconStyle } from "../common/IconStyle";
import { RichTextEditor } from "../common/RichTextEditor";
import { ActionFactory } from "../common/actions/ActionFactory";
import { ListItemFooterRow } from "../overview/ListItemFooterRow";
import { Markdown } from "../details/scraps/markdown/Markdown";
import { useAppContext } from "../../AppContext";
import { translations } from "../../i18n/translations";
import { useScratchpad } from "./useScratchpad";

export const ScratchpadPage: React.FC = () => {
  const { setAppAlert } = useAppContext();
  const { isLoaded, content, edit, save } = useScratchpad();
  const [isEditMode, setIsEditMode] = useState(false);

  const copyAction = ActionFactory.copyValueToClipboard(content, setAppAlert);

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
          {isEditMode ? (
            <RichTextEditor
              initialValue={content}
              setValue={edit}
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
                    ActionFactory.save(
                      async () => {
                        save();
                        setIsEditMode(false);
                      },
                      false,
                      true,
                    ),
                    copyAction,
                  ]
                : [
                    ActionFactory.editScrap(() => setIsEditMode(true), true),
                    copyAction,
                  ]
            }
          />
        </PageSection>
      ) : null}
    </Page>
  );
};
