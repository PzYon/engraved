export function shouldRenderAsPills(optionsCount: number): boolean {
  return optionsCount <= 3;
}

export function getNextAttributeValues(
  selectedValues: string[] | undefined,
  clickedOptionKey: string,
): string[] {
  return selectedValues?.[0] === clickedOptionKey ? [] : [clickedOptionKey];
}
