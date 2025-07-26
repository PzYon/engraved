import { IJournal } from "../../../serverApi/IJournal";
import { IEntry } from "../../../serverApi/IEntry";
import { getUiSettings } from "../../../util/journalUtils";
import { calculateStreak } from "./calculateStreak";

export const Streak: React.FC<{ journal: IJournal; entries: IEntry[] }> = ({
  journal,
  entries,
}) => {
  const uiSettings = getUiSettings(journal);

  if (!uiSettings.streak?.mode || uiSettings.streak?.mode === "none") {
    return null;
  }

  const streak = calculateStreak(entries, uiSettings.streak.mode);

  return <div>{streak ? JSON.stringify(streak) : "no streak"}</div>;
};
