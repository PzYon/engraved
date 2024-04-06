import { ISchedule } from "../../serverApi/ISchedule";
import { useAppContext } from "../../AppContext";
import { Properties } from "../common/Properties";
import { getScheduleProperty } from "./scheduled/scheduleUtils";

export const ReadonlyTitleRow: React.FC<{
  title: React.ReactNode;
  hasFocus: boolean;
  schedules: Record<string, ISchedule>;
}> = ({ title, hasFocus, schedules }) => {
  const { user } = useAppContext();

  return (
    <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
      <span style={{ flexGrow: 1 }}>{title}</span>
      {hasFocus ? null : (
        <Properties
          properties={[
            getScheduleProperty(schedules?.[user.id]?.nextOccurrence),
          ]}
        />
      )}
    </div>
  );
};
