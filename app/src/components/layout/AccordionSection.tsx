import React from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  IconButton,
  Typography,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import styled from "styled-components";

export interface IAccordionHeaderAction {
  key: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

export const AccordionSection: React.FC<{
  title: string;
  expanded?: boolean;
  headerActions?: IAccordionHeaderAction[];
}> = ({ title, expanded, headerActions, children }) => {
  return (
    <StyledAccordion defaultExpanded={expanded}>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography>{title}</Typography>
        {headerActions?.length ? (
          <ButtonContainer>
            {headerActions.map((a) => (
              <IconButton key={a.key} color="secondary" aria-label={a.label}>
                {a.icon}
              </IconButton>
            ))}
          </ButtonContainer>
        ) : null}
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </StyledAccordion>
  );
};

const StyledAccordion = styled(Accordion)`
  margin: 20px 0;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-grow: 1;
  justify-content: end;
`;
