import React, { useEffect } from "react";
import { useJournalContext } from "./JournalContext";
import { styled } from "@mui/material";
import { Properties } from "../common/Properties";
import { DeviceWidth, useDeviceWidth } from "../common/useDeviceWidth";
import { useJournalProperties } from "../overview/journals/useJournalProperties";
import { Outlet } from "react-router-dom";
import { JournalType } from "../../serverApi/JournalType";
import { JournalEditPage } from "./edit/JournalEditPage";
import { ScrapsEditPage } from "./scraps/ScrapsEditPage";
import { JournalViewPage } from "./JournalViewPage";
import { ScrapsViewPage } from "./scraps/ScrapsViewPage";

import { useRecentlyViewedJournals } from "../layout/menu/useRecentlyViewedJournals";
import { MuiTheme } from "../../theming/engravedTheme";

export const JournalDetailsEdit: React.FC = () => {
  const { journal } = useJournalContext();

  const { addView } = useRecentlyViewedJournals();

  useEffect(() => {
    addView(journal.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [journal.id]);

  return journal.type === JournalType.Scraps ? (
    <ScrapsEditPage />
  ) : (
    <JournalEditPage />
  );
};

export const JournalDetailsView: React.FC = () => {
  const { journal } = useJournalContext();

  const { addView } = useRecentlyViewedJournals();

  useEffect(() => {
    addView(journal.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [journal.id]);

  return journal.type === JournalType.Scraps ? (
    <ScrapsViewPage />
  ) : (
    <JournalViewPage />
  );
};

export const JournalDetails: React.FC = () => {
  const { journal } = useJournalContext();
  const journalProperties = useJournalProperties(journal);
  const deviceWidth = useDeviceWidth();

  if (!journal) {
    return null;
  }

  return (
    <Host data-testid="journal" data-journal-id={journal.id}>
      <PropertiesContainer
        sx={deviceWidth === DeviceWidth.Small ? { pl: 2, pr: 2 } : {}}
      >
        <Properties properties={journalProperties} />
      </PropertiesContainer>

      <Outlet />
    </Host>
  );
};

const Host = styled("div")`
  padding-top: ${(p: MuiTheme) => p.theme.spacing(2)};
`;

const PropertiesContainer = styled("div")``;
