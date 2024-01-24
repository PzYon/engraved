import React from "react";
import { styled, Typography } from "@mui/material";

export const Titles: React.FC<{
  title: React.ReactNode;
  subTitle: React.ReactNode;
}> = ({ title, subTitle }) => {
  return (
    <Typography
      variant="h2"
      sx={{
        flexGrow: 1,
        color: "primary.main",
        display: "flex",
        alignItems: "center",
        width: "100%",
      }}
    >
      {getBody()}
    </Typography>
  );

  function getBody() {
    if (!title) {
      return <>&nbsp;</>;
    }

    if (!subTitle) {
      return title;
    }

    return (
      <>
        <>{title}</>
        <SubTitle>{subTitle}</SubTitle>
      </>
    );
  }
};

const SubTitle = styled("span")`
  &::before {
    content: "\\00B7";
    margin: 0 0.6rem;
  }
`;
