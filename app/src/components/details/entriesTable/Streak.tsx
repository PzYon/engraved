import { IJournal } from "../../../serverApi/IJournal";
import { IEntry } from "../../../serverApi/IEntry";
import { getUiSettings } from "../../../util/journalUtils";
import { calculateStreak } from "./calculateStreak";
import CheckCircle from "@mui/icons-material/CheckCircle";
import Warning from "@mui/icons-material/Warning";
import DoNotDisturb from "@mui/icons-material/DoNotDisturb";
import { styled } from "@mui/material";

export const Streak: React.FC<{ journal: IJournal; entries: IEntry[] }> = ({
  journal,
  entries,
}) => {
  const uiSettings = getUiSettings(journal);
  if (!uiSettings.streak?.mode || uiSettings.streak?.mode === "none") {
    return null;
  }

  const streak = calculateStreak(entries, uiSettings.streak.mode);

  if (!streak.isStreak) {
    return (
      <Host type={"red"}>
        <DoNotDisturb />
        No streak
      </Host>
    );
  }

  return (
    <Host type={streak.hasEntryToday ? "green" : "yellow"}>
      {streak.hasEntryToday ? <CheckCircle /> : <Warning />}
      {`${streak.length}-day streak`}
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
