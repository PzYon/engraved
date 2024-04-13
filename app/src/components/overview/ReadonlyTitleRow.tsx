import { useAppContext } from "../../AppContext";
import { Properties } from "../common/Properties";
import { getScheduleProperty } from "./scheduled/scheduleUtils";
import { useDisplayModeContext } from "./overviewList/DisplayModeContext";
import { IEntity } from "../../serverApi/IEntity";

export const ReadonlyTitleRow: React.FC<{
  title: React.ReactNode;
  hasFocus: boolean;
  entity: IEntity;
}> = ({ title, hasFocus, entity }) => {
  const { user } = useAppContext();
  const { isCompact } = useDisplayModeContext();

  return (
    <span style={{ display: "flex", alignItems: "center", width: "100%" }}>
      <span style={{ flexGrow: 1 }}>{title}</span>
      {!hasFocus && isCompact ? (
        <Properties properties={[getScheduleProperty(entity, user.id)]} />
      ) : null}
    </span>
  );
};
