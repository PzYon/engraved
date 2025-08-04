import React, { useEffect, useState } from "react";
import { IScrapEntry } from "../../../serverApi/IScrapEntry";
import { ScrapInner } from "./ScrapInner";
import { EntryPropsRenderStyle } from "../../common/entries/Entry";
import { ActionsRenderStyle } from "./ScrapContext";
import { ScrapContextProvider } from "./ScrapContextProvider";
import { IJournal } from "../../../serverApi/IJournal";

export const Scrap: React.FC<{
  scrap: IScrapEntry;
  journal?: IJournal;
  propsRenderStyle: EntryPropsRenderStyle;
  actionsRenderStyle?: ActionsRenderStyle;
  hasFocus?: boolean;
  onSuccess?: () => void;
  onCancelEditing?: () => void;
  giveFocus?: () => void;
  isQuickAdd?: boolean;
  changeTypeWithoutConfirmation?: boolean;
  testId?: string;
}> = ({
  scrap,
  journal,
  propsRenderStyle,
  actionsRenderStyle,
  hasFocus,
  onSuccess,
  onCancelEditing,
  giveFocus,
  isQuickAdd,
  changeTypeWithoutConfirmation,
  testId,
}) => {
  const [doRender, setDoRender] = useState(hasFocus);

  useEffect(() => {
    setTimeout(() => setDoRender(true));
  }, []);

  if (!doRender) {
    return false;
  }

  return (
    <div id={scrap.id} data-testid={testId}>
      <ScrapContextProvider
        initialScrap={scrap}
        propsRenderStyle={propsRenderStyle}
        actionsRenderStyle={actionsRenderStyle}
        journal={journal}
        onSuccess={onSuccess}
        onCancelEditing={onCancelEditing}
        hasFocus={hasFocus}
        giveFocus={giveFocus}
        isQuickAdd={isQuickAdd}
        changeTypeWithoutConfirmation={changeTypeWithoutConfirmation}
      >
        <ScrapInner />
      </ScrapContextProvider>
    </div>
  );
};
