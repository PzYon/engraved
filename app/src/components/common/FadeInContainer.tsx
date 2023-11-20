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
        console.log("ja");
        setTimeout(() => {
          setIsRendered(true);
        }, 100);
      }, 10000);
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
