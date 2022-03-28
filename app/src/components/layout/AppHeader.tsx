import React from "react";
import { Link } from "react-router-dom";
import { Box, styled, Typography } from "@mui/material";
import { useAppContext } from "../../AppContext";
import { HeaderActions } from "./HeaderActions";

export const AppHeader: React.FC = () => {
  const { pageTitle, titleActions } = useAppContext();

  return (
    <Box sx={{ marginBottom: "20px" }}>
      <Box
        sx={{
          backgroundColor: "secondary.main",
          marginBottom: "20px",
        }}
      >
        <ContentWrapper>
          <Link to="/">
            <Typography variant="h1" sx={{ fontFamily: "Lilita One" }}>
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
    </Box>
  );
};

const ContentWrapper = styled(Box)({
  maxWidth: "1200px",
  margin: "auto",
  display: "flex",

  a: {
    color: "white !important",
  },
});
