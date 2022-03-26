import React from "react";
import { PageHeader } from "./PageHeader";
import { Link } from "react-router-dom";
import { Typography } from "@mui/material";
import { useAppContext } from "../../AppContext";
import styled from "styled-components";
import { HeaderActions } from "./HeaderActions";

export const AppHeader: React.FC = () => {
  const { pageTitle, titleActions } = useAppContext();

  return (
    <Host>
      <PageHeader>
        <Link to="/">
          <Typography variant="h2">metrix</Typography>
        </Link>
      </PageHeader>
      <PageHeader>
        <Typography variant="h3" sx={{ flexGrow: 1 }}>
          {pageTitle}
        </Typography>
        <HeaderActions actions={titleActions} />
      </PageHeader>
    </Host>
  );
};

const Host = styled.div`
  margin-bottom: 20px;
`;
