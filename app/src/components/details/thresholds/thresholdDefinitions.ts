import { IJournalThresholdDefinitions } from "../../../serverApi/IJournalThresholdDefinitions";
import { IAttributeValueThresholdDefinition } from "./ThresholdRow";
import { ThresholdScope } from "./ThresholdScope";

export function createDefinitions(
  thresholds: IJournalThresholdDefinitions | undefined,
): IAttributeValueThresholdDefinition[] {
  const resolvedThresholds = thresholds ?? {};
  return Object.keys(resolvedThresholds).flatMap((attributeKey) => {
    return Object.keys(resolvedThresholds[attributeKey]).map((x) => {
      return {
        attributeKey: attributeKey,
        threshold: resolvedThresholds[attributeKey][x].value,
        scope: resolvedThresholds[attributeKey][x].scope,
        attributeValueKeys: [x],
      };
    });
  });
}

export function createThresholds(
  thresholdDefinitions: IAttributeValueThresholdDefinition[],
): IJournalThresholdDefinitions {
  const thresholds: IJournalThresholdDefinitions = {};

  for (const definition of thresholdDefinitions) {
    const attrKey = definition.attributeKey ?? "-";
    if (!thresholds[attrKey]) {
      thresholds[attrKey] = {};
    }

    thresholds[attrKey][definition.attributeValueKeys[0] ?? "-"] = {
      value: definition.threshold ?? 0,
      scope: definition.scope ?? ThresholdScope.All,
    };
  }

  return thresholds;
}

export function isComplete(definition: IAttributeValueThresholdDefinition) {
  if (!definition.threshold || !definition.scope) {
    return false;
  }

  if (
    (!definition.attributeKey || definition.attributeKey === "-") &&
    (!definition.attributeValueKeys.length ||
      (definition.attributeValueKeys.length === 1 &&
        definition.attributeValueKeys[0] === "-"))
  ) {
    return true;
  }

  if (definition.attributeKey && definition.attributeKey !== "-") {
    return true;
  }

  return false;
}
