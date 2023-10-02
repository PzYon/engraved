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
      href: "/activities",
      label: "Entries",
      isSelected: selectedKey === "entries",
    },
  ];
};
