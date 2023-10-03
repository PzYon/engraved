import { IPageTab } from "./IPageTab";

export const getPageTabs = (
  selectedKey: "journals" | "entries",
): IPageTab[] => {
  return [
    {
      key: "journals",
      href: "/journals",
      label: "Journals",
      isSelected: selectedKey === "journals",
    },
    {
      key: "entries",
      href: "/entries",
      label: "Entries",
      isSelected: selectedKey === "entries",
    },
  ];
};
