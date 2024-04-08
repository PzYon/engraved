import { ISchedule } from "../../serverApi/ISchedule";
import { useAppContext } from "../../AppContext";
import { Properties } from "../common/Properties";
import { getScheduleProperty } from "./scheduled/scheduleUtils";
import { useDisplayModeContext } from "./overviewList/DisplayModeContext";

export const ReadonlyTitleRow: React.FC<{
  title: React.ReactNode;
  hasFocus: boolean;
  schedules: Record<string, ISchedule>;
}> = ({ title, hasFocus, schedules }) => {
  const { user } = useAppContext();
  const { isCompact } = useDisplayModeContext();

  console.log("has focus: ", hasFocus);

  return (
    <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
      <span style={{ flexGrow: 1 }}>{title}</span>
      {!hasFocus && isCompact ? (
        <Properties
          properties={[
            getScheduleProperty(schedules?.[user.id]?.nextOccurrence),
          ]}
        />
      ) : null}
    </div>
  );
};
