import React from "react";
import { Entities } from "../search/Entities";

export const Scheduled: React.FC = () => (
  <Entities isSchedule={true} executeWithoutConditions={true}></Entities>
);
