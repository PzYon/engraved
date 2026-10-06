import { endOfMonth } from "date-fns";
import { DateFilterConfig } from "../edit/DateFilterConfig";
import { createNextDateConditions } from "./createDateConditions";
import { DateRange } from "./DateRange";

describe("createNextDateConditions", () => {
  describe("month", () => {
    const monthConfig: DateFilterConfig = {
      dateType: "range",
      value: DateRange.Month,
    };

    const january = 0;
    const december = 11;
    const allMonths = Array.from({ length: 12 }, (_, month) => month);

    function getMonth(year: number, month: number) {
      const from = new Date(year, month, 1);
      return { from, to: endOfMonth(from) };
    }

    it.each(allMonths)(
      "should go to the previous month from month %i",
      (month) => {
        const result = createNextDateConditions(
          "previous",
          monthConfig,
          getMonth(2026, month),
        );

        expect(result).toEqual(
          month === january
            ? getMonth(2025, december)
            : getMonth(2026, month - 1),
        );
      },
    );

    it.each(allMonths)("should go to the next month from month %i", (month) => {
      const result = createNextDateConditions(
        "next",
        monthConfig,
        getMonth(2026, month),
      );

      expect(result).toEqual(
        month === december
          ? getMonth(2027, january)
          : getMonth(2026, month + 1),
      );
    });

    it("should go from march to february in a leap year", () => {
      const result = createNextDateConditions(
        "previous",
        monthConfig,
        getMonth(2028, 2),
      );

      expect(result).toEqual({
        from: new Date(2028, 1, 1),
        to: endOfMonth(new Date(2028, 1, 29)),
      });
    });
  });
});
