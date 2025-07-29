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
  const mode = getUiSettings(journal)?.streak?.mode;
  if (!mode || mode === "none") {
    return null;
  }

  const streak = calculateStreak(entries, mode);

  if (!streak.isStreak) {
    return (
      <Host type={"red"}>
        <DoNotDisturb />
        No streak
      </Host>
    );
  }

  const isWarning = mode === "positive" && !streak.hasEntryToday;

  return (
    <Host type={isWarning ? "yellow" : "green"}>
      {isWarning ? <Warning /> : <CheckCircle />}
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
