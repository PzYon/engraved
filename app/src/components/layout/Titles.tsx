import React from "react";
import { Typography } from "@mui/material";

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
        justifyContent: "center",
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
        <>{title}</>|<>{subTitle}</>
      </>
    );
  }
};
