import React from "react";
import styled from "styled-components";

export const PageHeader: React.FC = ({ children }) => {
  return <Host>{children}</Host>;
};

const Host = styled.header`
  width: 100%;
  padding: 20px;
  margin-left: -20px;
  margin-bottom: 20px;
  margin-top: -20px;
  background-color: grey;
`;
