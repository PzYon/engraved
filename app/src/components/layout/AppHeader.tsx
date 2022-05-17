import React from "react";
import { Link } from "react-router-dom";
import { Avatar, Box, styled, Typography } from "@mui/material";
import { useAppContext } from "../../AppContext";
import { HeaderActions } from "./HeaderActions";

export const AppHeader: React.FC = () => {
  const { pageTitle, titleActions, user } = useAppContext();

  return (
    <Host>
      <Box
        sx={{
          backgroundColor: "primary.main",
          mb: 2,
        }}
      >
        <ContentWrapper>
          <Link to="/" style={{ flexGrow: 1 }}>
            <Typography variant="h1" sx={{ fontFamily: "Chewy" }}>
              metrix
            </Typography>
          </Link>
          <Avatar
            alt={user.name}
            src={user.imageUrl}
            imgProps={{ referrerPolicy: "no-referrer" }}
          />
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

const Host = styled("div")`
  margin-bottom: ${(p) => p.theme.spacing(2)};
`;

const ContentWrapper = styled("div")`
  max-width: 1200px;
  margin: auto;
  padding: 0 ${(p) => p.theme.spacing(2)};
  display: flex;
  align-items: center;

  a {
    color: ${(p) => p.theme.palette.common.white} !important;
  }
`;
