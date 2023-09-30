import { ITab } from "./ITab";

export const getPageTabs = (): ITab[] => {
  return [
    {
      key: "metrics",
      href: "/metrics",
      label: "Metrics",
    },
    { key: "activities", href: "/activities", label: "Activities" },
  ];
};
