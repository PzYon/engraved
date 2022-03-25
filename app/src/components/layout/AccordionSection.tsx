import React from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import styled from "styled-components";
import { HeaderActions, IAction } from "./HeaderActions";

export const AccordionSection: React.FC<{
  title: string;
  subTitle?: string;
  expanded?: boolean;
  headerActions?: IAction[];
  expandIcon?: React.ReactNode;
}> = ({ title, subTitle, expanded, headerActions, expandIcon, children }) => {
  return (
    <StyledAccordion defaultExpanded={expanded}>
      <AccordionSummary expandIcon={expandIcon ?? <ExpandMore />}>
        <HeaderContainer>
          <TextContainer>
            <Typography sx={{ flexShrink: 0 }}>{title}</Typography>
            {subTitle ? (
              <>
                <MiddleDotContainer>&#183;</MiddleDotContainer>
                <Typography sx={{ color: "text.secondary" }} noWrap={true}>
                  {subTitle}
                </Typography>
              </>
            ) : null}
          </TextContainer>
          <HeaderActions actions={headerActions} />
        </HeaderContainer>
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </StyledAccordion>
  );
};

const StyledAccordion = styled(Accordion)`
  margin: 20px 0;
`;

const HeaderContainer = styled.div`
  display: flex;
  width: 100%;
`;

const TextContainer = styled.div`
  flex-grow: 1;
  display: flex;
  align-items: center;
`;

const MiddleDotContainer = styled.div`
  display: inline-block;
  padding: 0 15px;
`;
