import React from "react";
import { PageHeader } from "./PageHeader";
import { Link } from "react-router-dom";
import { Typography } from "@mui/material";
import { PageTitle } from "./PageTitle";
import { useAppContext } from "../../AppContext";

export const AppHeader: React.FC = () => {
  const title = useAppContext().pageTitle;

  return (
    <>
      <PageHeader>
        <Link to="/">
          <Typography variant="h2">metrix</Typography>
        </Link>
      </PageHeader>
      <PageHeader>
        <PageTitle title={title} />
      </PageHeader>
    </>
  );
};
