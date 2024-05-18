import React from "react";
import { useJournalContext } from "./JournalContext";
import { JournalType } from "../../serverApi/JournalType";
import { Route, Routes, useNavigate } from "react-router-dom";
import { EditJournalPermissionsLauncher } from "./edit/EditJournalPermissionsLauncher";
import { JournalViewPage } from "./JournalViewPage";
import { JournalEditPage } from "./edit/JournalEditPage";
import { DeleteJournal } from "./edit/DeleteJournal";
import { IJournal } from "../../serverApi/IJournal";
import { ScrapsViewPage } from "./scraps/ScrapsViewPage";
import { ScrapsEditPage } from "./scraps/ScrapsEditPage";
import { EditScheduleLauncher } from "./edit/EditScheduleLauncher";
import { styled } from "@mui/material";
import { Properties } from "../common/Properties";
import { DeviceWidth, useDeviceWidth } from "../common/useDeviceWidth";
import { useJournalProperties } from "../overview/journals/useJournalProperties";
import { OnNotificationLauncher } from "./OnNotificationLauncher";
import { NotificationDoneLauncher } from "./NotificationDoneLauncher";

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
      <SubRoutes journal={journal} />
    </Host>
  );
};

const SubRoutes: React.FC<{
  journal: IJournal;
}> = ({ journal }) => {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route
        path="/permissions"
        element={<EditJournalPermissionsLauncher journal={journal} />}
      />
      <Route
        path="/schedule"
        element={<EditScheduleLauncher journal={journal} />}
      />
      <Route
        path="/notification"
        element={<OnNotificationLauncher journal={journal} />}
      />
      <Route
        path="/notification-done"
        element={<NotificationDoneLauncher journal={journal} />}
      />
      <Route
        path="/delete"
        element={
          <DeleteJournal
            journal={journal}
            onCancel={() => navigate("../../")}
          />
        }
      />
    </Routes>
  );
};

const Host = styled("div")`
  padding-top: ${(p) => p.theme.spacing(2)};
`;

const PropertiesContainer = styled("div")``;
