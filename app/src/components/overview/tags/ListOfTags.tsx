import { Link } from "react-router-dom";
import { useAppContext } from "../../../AppContext";
import React from "react";
import { GridContainer, GridItem } from "../../common/Grid";
import { Paper, Typography } from "@mui/material";
import { ReadonlyTitle } from "../ReadonlyTitle";

export const ListOfTags: React.FC = () => {
  const { user } = useAppContext();

  const tagNames = Object.keys(user.tags ?? {});

  if (!tagNames.length) {
    return <div>no tags.</div>;
  }

  return (
    <GridContainer>
      {tagNames.map((t) => (
        <GridItem key={t}>
          <Paper sx={{ p: 3 }}>
            <ReadonlyTitle
              hasFocus={false}
              entity={null}
              title={<Link to={`/tags/${t}`}>{t}</Link>}
            ></ReadonlyTitle>
            <Typography sx={{ pt: 1 }}>{getJournalCountLabel(t)}</Typography>
          </Paper>
        </GridItem>
      ))}
    </GridContainer>
  );

  function getJournalCountLabel(tagName: string) {
    const count = user.tags[tagName].length;
    return `${count} journal${count === 1 ? "" : "s"}`;
  }
};
