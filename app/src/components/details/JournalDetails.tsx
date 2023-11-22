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
import { JournalProperties } from "../overview/JournalProperties";

export const JournalDetails: React.FC = () => {
  const { journal } = useJournalContext();

  if (!journal) {
    return null;
  }

  return (
    <div data-testid="journal" data-journal-id={journal.id}>
      <JournalProperties journal={journal} position={"details"} />

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
    </div>
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
