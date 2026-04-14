import { IEntriesTableGroup } from "./IEntriesTableGroup";
import { Tooltip } from "@mui/material";

export const GroupedValue: React.FC<{ group: IEntriesTableGroup }> = ({
  group,
}) => {
  return (
    <span>
      {group.totalString}{" "}
      <Tooltip title={`${group.entries.length} entries`}>
        <span style={{ opacity: 0.5, fontSize: "smaller" }}>
          {group.entries.length}x
        </span>
      </Tooltip>
    </span>
  );
};
