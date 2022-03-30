import React from "react";
import { Link } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { useAppContext } from "../../AppContext";
import styled from "styled-components";
import { HeaderActions } from "./HeaderActions";

export const AppHeader: React.FC = () => {
  const { pageTitle, titleActions } = useAppContext();

  return (
    <Host>
      <Box
        sx={{
          backgroundColor: "primary.main",
          marginBottom: "20px",
        }}
      >
        <ContentWrapper>
          <Link to="/">
            <Typography variant="h1" sx={{ fontFamily: "Chewy" }}>
              metrix
            </Typography>
          </Link>
        </ContentWrapper>
      </Box>
      <ContentWrapper>
        <Typography variant="h2" sx={{ flexGrow: 1 }}>
          {pageTitle}
        </Typography>
        <HeaderActions actions={titleActions} />
      </ContentWrapper>
    </Host>
  );
};

const Host = styled.div`
  margin-bottom: 20px;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: auto;
  padding: 0 20px;
  display: flex;

  a {
    color: white !important;
  }
`;
