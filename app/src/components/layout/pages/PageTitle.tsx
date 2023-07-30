import React from "react";
import { styled } from "@mui/material";

export const PageTitle: React.FC<{ icon: React.ReactNode; title: string }> = ({
  icon,
  title,
}) => (
  <>
    {icon}
    <Title>{title}</Title>
  </>
);

const Title = styled("span")`
  flex-grow: 1;
`;
