import React from "react";

export const PageTitle: React.FC<{ icon: React.ReactNode; title: string }> = ({
  icon,
  title,
}) => (
  <>
    {icon}
    <span>{title}</span>
  </>
);
