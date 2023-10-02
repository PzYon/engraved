import { IPageTab } from "./IPageTab";

export const getPageTabs = (
  selectedKey: "journals" | "entries",
): IPageTab[] => {
  return [
    {
      key: "metrics",
      href: "/journals",
      label: "Metrics",
      isSelected: selectedKey === "journals",
    },
    {
      key: "activities",
      href: "/activities",
      label: "Activities",
      isSelected: selectedKey === "entries",
    },
  ];
};
