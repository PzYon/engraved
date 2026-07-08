import React, { useEffect } from "react";
import { useJournalContext } from "./JournalContext";
import { styled } from "@mui/material";
import { Properties } from "../common/Properties";
import { DeviceWidth, useDeviceWidth } from "../common/useDeviceWidth";
import { useJournalProperties } from "../overview/journals/useJournalProperties";
import { Outlet } from "@tanstack/react-router";
import { JournalType } from "../../serverApi/JournalType";
import { JournalEditPage } from "./edit/JournalEditPage";
import { ScrapsEditPage } from "./scraps/ScrapsEditPage";
import { JournalViewPage } from "./JournalViewPage";
import { ScrapsViewPage } from "./scraps/ScrapsViewPage";
import { addRecentlyViewedJournal } from "../layout/menu/useRecentlyViewedJournals";
import { LogBookViewPage } from "./scraps/LogBookViewPage";
import { OfflinePlaceholder } from "../common/search/OfflinePlaceholder";
import { useIsOffline } from "../common/useIsOffline";

export const JournalDetailsEdit: React.FC = () => {
  const { journal } = useJournalContext();

  useEffect(() => {
    addRecentlyViewedJournal(journal.id ?? "");
  }, [journal.id]);

  return journal.type === JournalType.Scraps ||
    journal.type === JournalType.LogBook ? (
    <ScrapsEditPage />
  ) : (
    <JournalEditPage />
  );
};

export const JournalDetailsView: React.FC = () => {
  const { journal } = useJournalContext();

  useEffect(() => {
    addRecentlyViewedJournal(journal.id ?? "");
  }, [journal.id]);

  return journal.type === JournalType.Scraps ? (
    <ScrapsViewPage key={journal.id} />
  ) : journal.type === JournalType.LogBook ? (
    <LogBookViewPage key={journal.id} />
  ) : (
    <JournalViewPage key={journal.id} />
  );
};

export const JournalDetails: React.FC = () => {
  const { journal } = useJournalContext();
  const journalProperties = useJournalProperties(journal);
  const deviceWidth = useDeviceWidth();
  const isOffline = useIsOffline();

  if (!journal) {
    // undefined means not loaded (yet) - when offline that is because the
    // journal has not been cached and cannot be fetched until back online.
    return isOffline ? <OfflinePlaceholder /> : null;
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
  padding-top: ${(p) => p.theme.spacing(2)};
`;

const PropertiesContainer = styled("div")``;
