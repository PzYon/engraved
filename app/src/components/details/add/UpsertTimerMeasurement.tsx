import { ITimerMeasurement } from "../../../serverApi/ITimerMeasurement";
import { FormElementContainer } from "../../common/FormUtils";
import { DateSelector } from "../../common/DateSelector";
import React, { useEffect } from "react";

export const UpsertTimerMeasurement: React.FC<{
  measurement: ITimerMeasurement;
  setStartDate: (startDate: Date) => void;
  setEndDate: (endDate: Date) => void;
}> = ({ measurement, setStartDate, setEndDate }) => {
  const startDate = measurement?.startDate
    ? new Date(measurement.startDate)
    : undefined;

  const endDate = measurement?.endDate
    ? new Date(measurement.endDate)
    : undefined;

  useEffect(() => {
    if (startDate && !endDate) {
      setEndDate(new Date());
    }
  }, []);

  return (
    <>
      <FormElementContainer>
        <DateSelector
          label={"Start date"}
          date={startDate}
          setDate={setStartDate}
          showTime={true}
        />
      </FormElementContainer>
      <FormElementContainer>
        <DateSelector
          label={"End date"}
          date={endDate}
          setDate={setEndDate}
          showTime={true}
        />
      </FormElementContainer>
    </>
  );
};
