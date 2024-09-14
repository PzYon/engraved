import { IPageTab } from "./IPageTab";

export const getPageTabs = (
  selectedKey: "journals" | "entries" | "scheduled" | "tags",
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
  {
    key: "tags",
    href: "/tags",
    label: "Tags",
    isSelected: selectedKey === "tags",
  },
];
