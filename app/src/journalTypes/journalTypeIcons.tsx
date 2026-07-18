import React from "react";
import { JournalType } from "../serverApi/JournalType";
import PlusOneSharp from "@mui/icons-material/PlusOneSharp";
import BarChartSharp from "@mui/icons-material/BarChartSharp";
import TimerSharp from "@mui/icons-material/TimerSharp";
import DynamicFeedOutlined from "@mui/icons-material/DynamicFeedOutlined";
import CalendarMonth from "@mui/icons-material/CalendarMonth";

export const journalTypeIcons: Record<JournalType, React.ReactNode> = {
  [JournalType.Counter]: (
    <PlusOneSharp style={{ backgroundColor: "#DFFFE3" }} />
  ),
  [JournalType.Gauge]: <BarChartSharp style={{ backgroundColor: "#FFFFDF" }} />,
  [JournalType.Timer]: <TimerSharp style={{ backgroundColor: "#FFDFEC" }} />,
  [JournalType.Scraps]: (
    <DynamicFeedOutlined style={{ backgroundColor: "#DFEEFF" }} />
  ),
  [JournalType.LogBook]: (
    <CalendarMonth style={{ backgroundColor: "#eeeeee" }} />
  ),
};
