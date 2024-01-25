import React from "react";
import { useJournalContext } from "./JournalDetailsContext";
import { JournalType } from "../../serverApi/JournalType";
import { Route, Routes, useNavigate } from "react-router-dom";
import { EditJournalPermissionsLauncher } from "./edit/EditJournalPermissionsLauncher";
import { JournalViewPage } from "./JournalViewPage";
import { JournalEditPage } from "./edit/JournalEditPage";
import { DeleteJournalLauncher } from "./edit/DeleteJournalLauncher";
import { IJournal } from "../../serverApi/IJournal";
import { ScrapsViewPage } from "./scraps/ScrapsViewPage";
import { ScrapsEditPage } from "./scraps/ScrapsEditPage";
import { ScrapsMovePage } from "./scraps/ScrapsMovePage";
import { EditScheduleLauncher } from "./edit/EditScheduleLauncher";
import { styled } from "@mui/material";
import { Properties } from "../common/Properties";
import { useJournalProperties } from "../overview/JournalProperties";

export const JournalDetails: React.FC = () => {
  const { journal } = useJournalContext();
  const journalProperties = useJournalProperties(journal);

  if (!journal) {
    return null;
  }

  return (
    <Host data-testid="journal" data-journal-id={journal.id}>
      <Properties properties={journalProperties} />

      <Routes>
        {journal.type === JournalType.Scraps ? (
          <>
            <Route path="/edit" element={<ScrapsEditPage />} />
            <Route path="/*" element={<ScrapsViewPage />} />
            <Route path="/entries/:entryId/move" element={<ScrapsMovePage />} />
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
        path="/delete"
        element={
          <DeleteJournalLauncher
            journal={journal}
            onDeleted={() => navigate("../../")}
          />
        }
      />
    </Routes>
  );
};

const Host = styled("div")`
  padding-top: ${(p) => p.theme.spacing(2)};
`;
