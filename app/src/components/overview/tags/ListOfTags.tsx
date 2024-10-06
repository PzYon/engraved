import { Link } from "react-router-dom";
import { useAppContext } from "../../../AppContext";
import React from "react";
import { GridContainer, GridItem } from "../../common/Grid";
import { Paper, Typography } from "@mui/material";
import { ReadonlyTitle } from "../ReadonlyTitle";
import { IUserTag } from "../../../serverApi/IUserTag";
import { NoResultsFound } from "../../common/search/NoResultsFound";

export const ListOfTags: React.FC = () => {
  const { user } = useAppContext();

  if (!user.tags.length) {
    return <NoResultsFound hideTryAgain={true} />;
  }

  return (
    <GridContainer>
      {user.tags.map((t) => (
        <GridItem key={t.id}>
          <Paper sx={{ p: 3 }}>
            <ReadonlyTitle
              hasFocus={false}
              entity={null}
              title={<Link to={`/tags/${t.id}`}>{t.label}</Link>}
            ></ReadonlyTitle>
            <Typography sx={{ pt: 1 }}>{getJournalCountLabel(t)}</Typography>
          </Paper>
        </GridItem>
      ))}
    </GridContainer>
  );

  function getJournalCountLabel(tag: IUserTag) {
    const count = tag.journalIds?.length ?? 0;
    return `${count} journal${count === 1 ? "" : "s"}`;
  }
};
