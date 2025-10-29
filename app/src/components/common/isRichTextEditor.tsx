export function isRichTextEditor(target: HTMLElement) {
  return (
    target?.attributes.getNamedItem("role")?.value === "textbox" ||
    target?.className.indexOf("tiptap") > -1
  );
}
