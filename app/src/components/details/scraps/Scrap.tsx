import React, { useEffect, useState } from "react";
import { IScrapEntry } from "../../../serverApi/IScrapEntry";
import { ScrapInner } from "./ScrapInner";
import { EntryPropsRenderStyle } from "../../common/entries/Entry";
import { ActionsRenderStyle } from "./ScrapContext";
import { ScrapContextProvider } from "./ScrapContextProvider";
import { IJournal } from "../../../serverApi/IJournal";

export const Scrap: React.FC<{
  scrap: IScrapEntry;
  journal: IJournal;
  propsRenderStyle: EntryPropsRenderStyle;
  actionsRenderStyle?: ActionsRenderStyle;
  hasFocus?: boolean;
  onSuccess?: () => void;
  giveFocus?: () => void;
}> = ({
  scrap: currentScrap,
  journal,
  propsRenderStyle,
  actionsRenderStyle,
  hasFocus,
  onSuccess,
  giveFocus,
}) => {
  const [doRender, setDoRender] = useState(hasFocus);

  useEffect(() => {
    setTimeout(() => setDoRender(true));
  }, []);

  if (!doRender) {
    return false;
  }

  return (
    <div id={currentScrap.id}>
      <ScrapContextProvider
        currentScrap={currentScrap}
        propsRenderStyle={propsRenderStyle}
        actionsRenderStyle={actionsRenderStyle}
        journal={journal}
        onSuccess={onSuccess}
        hasFocus={hasFocus}
        giveFocus={giveFocus}
      >
        <ScrapInner />
      </ScrapContextProvider>
    </div>
  );
};
