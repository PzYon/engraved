import { Button } from "@mui/material";
import { addDays } from "date-fns";
import React from "react";
import { ButtonContainer } from "./ButtonContainer";

interface DateAdjustmentButtonsProps {
  date: Date | null | undefined;
  setDate: (date: Date) => void;
}

export const DateAdjustmentButtons: React.FC<DateAdjustmentButtonsProps> = ({
  date,
  setDate,
}) => {
  return (
    <ButtonContainer>
      <Button
        variant="text"
        sx={{ fontSize: "small" }}
        onClick={() => setDate(addDays(date ?? new Date(), -1))}
      >
        -1day
      </Button>
      <Button
        variant="text"
        sx={{ fontSize: "small" }}
        onClick={() => setDate(addDays(date ?? new Date(), 1))}
      >
        +1day
      </Button>
    </ButtonContainer>
  );
};
