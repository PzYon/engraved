import React, { MutableRefObject, useRef } from "react";
import { IScrapEntry } from "../../../serverApi/IScrapEntry";
import { styled } from "@mui/material";
import { ScrapInner } from "./ScrapInner";
import { PageSection } from "../../layout/pages/PageSection";
import { ScrapItemWrapper } from "./ScrapItemWrapper";
import { Wrapper } from "../../common/wrappers/Wrapper";
import { EntryPropsRenderStyle } from "../../common/entries/Entry";
import { ActionsRenderStyle } from "./ScrapContext";
import { ScrapContextProvider } from "./ScrapContextProvider";

export const Scrap: React.FC<{
  scrap: IScrapEntry;
  journalName: string;
  propsRenderStyle: EntryPropsRenderStyle;
  actionsRenderStyle?: ActionsRenderStyle;
  addWrapperItem?: (item: ScrapItemWrapper) => void;
  index?: number;
  withoutSection?: boolean;
  onClick?: () => void;
  hasFocus?: boolean;
  onSuccess?: () => void;
}> = ({
  scrap: currentScrap,
  journalName,
  propsRenderStyle,
  actionsRenderStyle,
  addWrapperItem,
  index,
  withoutSection,
  onClick,
  hasFocus,
  onSuccess,
}) => {
  const domElementRef: MutableRefObject<HTMLDivElement> =
    useRef<HTMLDivElement>(null);

  const Container = withoutSection ? SimpleDiv : PageSection;

  return (
    <Wrapper
      ref={domElementRef}
      id={currentScrap.id}
      tabIndex={index}
      onClick={onClick}
    >
      <Container>
        <ScrapContextProvider
          currentScrap={currentScrap}
          addScrapWrapper={addWrapperItem}
          domElementRef={domElementRef}
          propsRenderStyle={propsRenderStyle}
          actionsRenderStyle={actionsRenderStyle}
          journalName={journalName}
          onSuccess={onSuccess}
          hasFocus={hasFocus}
        >
          <ScrapInner />
        </ScrapContextProvider>
      </Container>
    </Wrapper>
  );
};

const SimpleDiv = styled("div")``;
