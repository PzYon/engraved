import React, { CSSProperties, MutableRefObject, useRef } from "react";
import { IScrapEntry } from "../../../serverApi/IScrapEntry";
import { styled } from "@mui/material";
import { ScrapInner } from "./ScrapInner";
import { PageSection } from "../../layout/pages/PageSection";
import { ScrapItemWrapper } from "./ScrapItemWrapper";
import { Wrapper } from "../../common/wrappers/Wrapper";
import { EntryPropsRenderStyle } from "../../common/entries/Entry";
import { ScrapContextProvider } from "./ScrapContext";

export const Scrap: React.FC<{
  scrap: IScrapEntry;
  journalName: string;
  propsRenderStyle: EntryPropsRenderStyle;
  hideActions?: boolean;
  style?: CSSProperties;
  addScrapWrapper?: (scrapWrapper: ScrapItemWrapper) => void;
  index?: number;
  withoutSection?: boolean;
  onClick?: () => void;
  hasFocus?: boolean;
}> = ({
  scrap: currentScrap,
  journalName,
  propsRenderStyle,
  hideActions,
  style,
  addScrapWrapper,
  index,
  withoutSection,
  onClick,
  hasFocus,
}) => {
  const domElementRef: MutableRefObject<HTMLDivElement> =
    useRef<HTMLDivElement>(null);

  const Container = withoutSection ? SimpleDiv : PageSection;

  return (
    <Wrapper ref={domElementRef} tabIndex={index} onClick={onClick}>
      <Container>
        <ScrapContextProvider
          currentScrap={currentScrap}
          addScrapWrapper={addScrapWrapper}
          domElementRef={domElementRef}
          propsRenderStyle={propsRenderStyle}
          journalName={journalName}
        >
          <ScrapInner
            //key={isEditMode.toString()}
            hideActions={hideActions}
            style={style}
            hasFocus={hasFocus}
          />
        </ScrapContextProvider>
      </Container>
    </Wrapper>
  );
};

const SimpleDiv = styled("div")``;
