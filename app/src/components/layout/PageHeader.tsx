import React from "react";
import styled from "styled-components";

export const PageHeader: React.FC = ({ children }) => {
  return (
    <Host>
      <ContentWrapper>{children}</ContentWrapper>
    </Host>
  );
};

const Host = styled.header`
  background-color: grey;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: auto;
  display: flex;
`;
