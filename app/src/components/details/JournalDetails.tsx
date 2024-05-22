import React from "react";
import { useJournalContext } from "./JournalContext";
import { styled } from "@mui/material";
import { Properties } from "../common/Properties";
import { DeviceWidth, useDeviceWidth } from "../common/useDeviceWidth";
import { useJournalProperties } from "../overview/journals/useJournalProperties";
import { JournalType } from "../../serverApi/JournalType";
import { Route, Routes } from "react-router-dom";
import { ScrapsEditPage } from "./scraps/ScrapsEditPage";
import { ScrapsViewPage } from "./scraps/ScrapsViewPage";
import { JournalEditPage } from "./edit/JournalEditPage";
import { JournalViewPage } from "./JournalViewPage";

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

      <Routes>
        {journal.type === JournalType.Scraps ? (
          <>
            <Route path="/edit" element={<ScrapsEditPage />} />
            <Route path="/*" element={<ScrapsViewPage />} />
          </>
        ) : (
          <>
            <Route path="/edit" element={<JournalEditPage />} />
            <Route path="/*" element={<JournalViewPage />} />
          </>
        )}
      </Routes>
    </Host>
  );
};

const Host = styled("div")`
  padding-top: ${(p) => p.theme.spacing(2)};
`;

const PropertiesContainer = styled("div")``;
