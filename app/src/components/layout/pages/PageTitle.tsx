import React from "react";
import styled from "styled-components";

export const PageTitle: React.FC<{ icon: React.ReactNode; title: string }> = ({
  icon,
  title,
}) => (
  <Host>
    {icon}
    <Title>{title}</Title>
  </Host>
);

const Host = styled.div`
  display: flex;
  justify-content: center;
`;

const Title = styled.div`
  flex-grow: 1;
`;
