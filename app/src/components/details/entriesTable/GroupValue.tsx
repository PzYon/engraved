import { IEntriesTableGroup } from "./IEntriesTableGroup";

export const GroupedValue: React.FC<{ group: IEntriesTableGroup }> = ({
  group,
}) => {
  return (
    <span>
      {group.totalString}{" "}
      <span
        style={{ opacity: 0.5, fontSize: "smaller" }}
        title={`${group.entries.length} entries`}
      >
        {group.entries.length}x
      </span>
    </span>
  );
};
