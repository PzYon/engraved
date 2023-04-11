import React from "react";
import { useActivitiesQuery } from "../../serverApi/reactQuery/queries/useActivitiesQuery";

export const Activities: React.FC = () => {
  const activities = useActivitiesQuery();

  if (!activities) {
    return null;
  }

  return (
    <ul>
      {activities.measurements.map((m) => {
        return <li key={m.id}>{m.dateTime}</li>;
      })}
    </ul>
  );
};
