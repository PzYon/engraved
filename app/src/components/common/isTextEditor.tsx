export function isTextEditor(target: HTMLElement) {
  return target?.attributes.getNamedItem("role")?.value === "textbox";
}
