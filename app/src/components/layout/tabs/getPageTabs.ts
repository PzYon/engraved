import { IPageTab } from "./IPageTab";

export const getPageTabs = (
  selectedKey: "journals" | "entries" | "scheduled",
): IPageTab[] => [
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
  {
    key: "scheduled",
    href: "/scheduled",
    label: "Scheduled",
    isSelected: selectedKey === "scheduled",
  },
];
