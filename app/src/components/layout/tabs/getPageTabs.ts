import { IPageTab } from "./IPageTab";

export const getPageTabs = (
  selectedKey: "metrics" | "activities",
): IPageTab[] => {
  return [
    {
      key: "metrics",
      href: "/metrics",
      label: "Metrics",
      isSelected: selectedKey === "metrics",
    },
    {
      key: "activities",
      href: "/activities",
      label: "Activities",
      isSelected: selectedKey === "activities",
    },
  ];
};
