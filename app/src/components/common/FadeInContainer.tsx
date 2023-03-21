import React, { ReactNode, useEffect, useState } from "react";
import { styled } from "@mui/material";

export const FadeInContainer: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => setIsRendered(true), []);

  return (
    <ContainerSection style={{ opacity: isRendered ? 1 : 0 }}>
      {children}
    </ContainerSection>
  );
};

const ContainerSection = styled("section")`
  transition: opacity 700ms;
`;
