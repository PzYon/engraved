import { endOfDay, endOfMonth } from "date-fns";
import { DateFilterConfig } from "../edit/DateFilterConfig";
import {
  createDateConditions,
  createNextDateConditions,
} from "./createDateConditions";
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

  describe("week", () => {
    const weekConfig: DateFilterConfig = {
      dateType: "range",
      value: DateRange.Week,
    };

    const sundayToSaturday = createDateConditions(
      weekConfig,
      new Date(2026, 9, 6),
    );

    it("should go to the next week", () => {
      const result = createNextDateConditions(
        "next",
        weekConfig,
        sundayToSaturday,
      );

      expect(result).toEqual({
        from: new Date(2026, 9, 11),
        to: endOfDay(new Date(2026, 9, 17)),
      });
    });

    it("should go to the previous week", () => {
      const result = createNextDateConditions(
        "previous",
        weekConfig,
        sundayToSaturday,
      );

      expect(result).toEqual({
        from: new Date(2026, 8, 27),
        to: endOfDay(new Date(2026, 9, 3)),
      });
    });
  });

  describe("custom", () => {
    const customConfig: DateFilterConfig = {
      dateType: "range",
      value: DateRange.Custom,
    };

    it("should go to the days following the range", () => {
      const result = createNextDateConditions("next", customConfig, {
        from: new Date(2026, 9, 1),
        to: new Date(2026, 9, 7),
      });

      expect(result).toEqual({
        from: new Date(2026, 9, 8),
        to: new Date(2026, 9, 14),
      });
    });

    it("should go to the days preceding the range", () => {
      const result = createNextDateConditions("previous", customConfig, {
        from: new Date(2026, 9, 1),
        to: new Date(2026, 9, 7),
      });

      expect(result).toEqual({
        from: new Date(2026, 8, 24),
        to: new Date(2026, 8, 30),
      });
    });

    it("should move a range of a single day by one day", () => {
      const result = createNextDateConditions("next", customConfig, {
        from: new Date(2026, 9, 5),
        to: new Date(2026, 9, 5),
      });

      expect(result).toEqual({
        from: new Date(2026, 9, 6),
        to: new Date(2026, 9, 6),
      });
    });
  });
});
