import { IJournalThresholdDefinitions } from "../../../serverApi/IJournalThresholdDefinitions";
import {
  createDefinitions,
  createThresholds,
  isComplete,
} from "./thresholdDefinitions";
import { ThresholdScope } from "./ThresholdScope";

describe("thresholdDefinitions", () => {
  describe("isComplete", () => {
    it("should be incomplete without a threshold", () => {
      const result = isComplete({
        attributeValueKeys: [],
        scope: ThresholdScope.Day,
      });

      expect(result).toBe(false);
    });

    it("should be complete with a threshold of zero", () => {
      const result = isComplete({
        attributeValueKeys: [],
        threshold: 0,
        scope: ThresholdScope.Day,
      });

      expect(result).toBe(true);
    });

    it("should be incomplete without a scope", () => {
      const result = isComplete({ attributeValueKeys: [], threshold: 5 });

      expect(result).toBe(false);
    });

    it("should be complete without an attribute", () => {
      const result = isComplete({
        attributeValueKeys: [],
        threshold: 5,
        scope: ThresholdScope.Day,
      });

      expect(result).toBe(true);
    });

    it("should be complete when the placeholder is selected as attribute and value", () => {
      const result = isComplete({
        attributeKey: "-",
        attributeValueKeys: ["-"],
        threshold: 5,
        scope: ThresholdScope.Day,
      });

      expect(result).toBe(true);
    });

    it("should be complete with an attribute", () => {
      const result = isComplete({
        attributeKey: "color",
        attributeValueKeys: ["blue"],
        threshold: 5,
        scope: ThresholdScope.Day,
      });

      expect(result).toBe(true);
    });

    it("should be incomplete with a value but no attribute", () => {
      const result = isComplete({
        attributeKey: "-",
        attributeValueKeys: ["blue"],
        threshold: 5,
        scope: ThresholdScope.Day,
      });

      expect(result).toBe(false);
    });
  });

  describe("createThresholds", () => {
    it("should group the definitions by attribute", () => {
      const result = createThresholds([
        {
          attributeKey: "color",
          attributeValueKeys: ["blue"],
          threshold: 5,
          scope: ThresholdScope.Day,
        },
        {
          attributeKey: "color",
          attributeValueKeys: ["red"],
          threshold: 7,
          scope: ThresholdScope.Month,
        },
        {
          attributeKey: "size",
          attributeValueKeys: ["large"],
          threshold: 9,
          scope: ThresholdScope.All,
        },
      ]);

      expect(result).toEqual({
        color: {
          blue: { value: 5, scope: ThresholdScope.Day },
          red: { value: 7, scope: ThresholdScope.Month },
        },
        size: {
          large: { value: 9, scope: ThresholdScope.All },
        },
      });
    });

    it("should use the placeholder for a definition without an attribute", () => {
      const result = createThresholds([
        { attributeValueKeys: [], threshold: 5, scope: ThresholdScope.Day },
      ]);

      expect(result).toEqual({
        "-": { "-": { value: 5, scope: ThresholdScope.Day } },
      });
    });

    it("should fall back to zero for all entries when nothing is set", () => {
      const result = createThresholds([{ attributeValueKeys: [] }]);

      expect(result).toEqual({
        "-": { "-": { value: 0, scope: ThresholdScope.All } },
      });
    });
  });

  describe("createDefinitions", () => {
    it("should return no definitions without thresholds", () => {
      expect(createDefinitions(undefined)).toEqual([]);
    });

    it("should create one definition per attribute value", () => {
      const result = createDefinitions({
        color: {
          blue: { value: 5, scope: ThresholdScope.Day },
          red: { value: 7, scope: ThresholdScope.Month },
        },
      });

      expect(result).toEqual([
        {
          attributeKey: "color",
          attributeValueKeys: ["blue"],
          threshold: 5,
          scope: ThresholdScope.Day,
        },
        {
          attributeKey: "color",
          attributeValueKeys: ["red"],
          threshold: 7,
          scope: ThresholdScope.Month,
        },
      ]);
    });

    it("should be reversed by createThresholds", () => {
      const thresholds: IJournalThresholdDefinitions = {
        "-": { "-": { value: 3, scope: ThresholdScope.All } },
        color: { blue: { value: 5, scope: ThresholdScope.Day } },
      };

      expect(createThresholds(createDefinitions(thresholds))).toEqual(
        thresholds,
      );
    });
  });
});
