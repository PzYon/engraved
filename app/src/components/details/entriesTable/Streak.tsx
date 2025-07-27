import { IJournal } from "../../../serverApi/IJournal";
import { IEntry } from "../../../serverApi/IEntry";
import { getUiSettings } from "../../../util/journalUtils";
import { calculateStreak } from "./calculateStreak";
import CheckCircle from "@mui/icons-material/CheckCircle";
import { styled } from "@mui/material";
import DoNotDisturb from "@mui/icons-material/DoNotDisturb";

export const Streak: React.FC<{ journal: IJournal; entries: IEntry[] }> = ({
  journal,
  entries,
}) => {
  const uiSettings = getUiSettings(journal);
  if (!uiSettings.streak?.mode || uiSettings.streak?.mode === "none") {
    return null;
  }

  const streak = calculateStreak(entries, uiSettings.streak.mode);

  console.log("Streak", streak);

  return (
    <Host
      type={
        streak.isStreak ? (streak.hasEntryToday ? "green" : "yellow") : "red"
      }
    >
      {streak.isStreak ? <CheckCircle /> : <DoNotDisturb />}{" "}
      {streak.isStreak ? `${streak.length}-day streak` : "No streak"}
    </Host>
  );
};

const Host = styled("span")<{ type: "red" | "yellow" | "green" }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  color: ${(p) => {
    return p.type === "red"
      ? p.theme.palette.error.main
      : p.type === "yellow"
        ? p.theme.palette.warning.main
        : p.theme.palette.success.main;
  }};
`;
