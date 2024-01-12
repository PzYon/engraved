import React, { ReactNode, useEffect, useState } from "react";
import { styled, SxProps } from "@mui/material";

export const FadeInContainer: React.FC<{
  children: ReactNode;
  doPulsate?: boolean;
  sx?: SxProps;
}> = ({ children, doPulsate, sx }) => {
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => setIsRendered(true), 20);

    let interval: number;
    if (doPulsate) {
      interval = window.setInterval(() => {
        setIsRendered(false);
        window.setTimeout(() => setIsRendered(true), 700);
      }, 15000);
    }

    return () => {
      window.clearTimeout(timeout);
      window.clearInterval(interval);
    };
  }, [doPulsate]);

  return (
    <ContainerSection sx={{ ...(sx ?? {}), opacity: isRendered ? 1 : 0 }}>
      {children}
    </ContainerSection>
  );
};

const ContainerSection = styled("section")`
  transition: opacity 700ms;
`;
