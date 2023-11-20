import React, { ReactNode, useEffect, useState } from "react";
import { styled } from "@mui/material";

export const FadeInContainer: React.FC<{
  children: ReactNode;
  doPulsate?: boolean;
}> = ({ children, doPulsate }) => {
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    setIsRendered(true);

    if (doPulsate) {
      setInterval(() => {
        setIsRendered(false);
        setTimeout(() => setIsRendered(true), 700);
      }, 15000);
    }
  }, []);

  return (
    <ContainerSection style={{ opacity: isRendered ? 1 : 0 }}>
      {children}
    </ContainerSection>
  );
};

const ContainerSection = styled("section")`
  transition: opacity 700ms;
`;
