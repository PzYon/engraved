import { DateParser } from "../edit/DateParser";
import React from "react";

// todo:
// - some print selection from FunkyDate -> user should easily see, what's going on
// - journal selector
// - what type do we select? md vs list.

export const AddNewNotificationDialog: React.FC<{
  onSuccess?: () => void;
}> = () => {
  return (
    <div>
      <DateParser
        onSelect={(x) => {
          console.log(x);
        }}
        onChange={(x) => {
          console.log(x);
        }}
        sx={{}}
      />
    </div>
  );
};
