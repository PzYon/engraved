import React from "react";
import { IScrapEntry } from "../../../serverApi/IScrapEntry";
import { styled } from "@mui/material";
import { ScrapInner } from "./ScrapInner";
import { PageSection } from "../../layout/pages/PageSection";
import { EntryPropsRenderStyle } from "../../common/entries/Entry";
import { ActionsRenderStyle } from "./ScrapContext";
import { ScrapContextProvider } from "./ScrapContextProvider";

export const Scrap: React.FC<{
  scrap: IScrapEntry;
  journalName: string;
  propsRenderStyle: EntryPropsRenderStyle;
  actionsRenderStyle?: ActionsRenderStyle;
  withoutSection?: boolean;
  hasFocus?: boolean;
  onSuccess?: () => void;
}> = ({
  scrap: currentScrap,
  journalName,
  propsRenderStyle,
  actionsRenderStyle,
  withoutSection,
  hasFocus,
  onSuccess,
}) => {
  const Container = withoutSection ? SimpleDiv : PageSection;

  return (
    <Container id={currentScrap.id}>
      <ScrapContextProvider
        currentScrap={currentScrap}
        propsRenderStyle={propsRenderStyle}
        actionsRenderStyle={actionsRenderStyle}
        journalName={journalName}
        onSuccess={onSuccess}
        hasFocus={hasFocus}
      >
        <ScrapInner />
      </ScrapContextProvider>
    </Container>
  );
};

const SimpleDiv = styled("div")``;
