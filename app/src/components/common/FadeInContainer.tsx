import React, { ReactNode, useEffect, useState } from "react";
import { styled, SxProps } from "@mui/material";

// Content should be there almost at once: it is often ready the moment it is
// rendered (cached data), and a long fade then only makes the app feel slow.
const fadeInMs = 150;

// A pulsating element fades out and back in to draw attention, which only
// reads as a pulse when it is slow.
const pulsateMs = 700;

export const FadeInContainer: React.FC<{
  children: ReactNode;
  doPulsate?: boolean;
  isReady?: boolean;
  sx?: SxProps;
  testId?: string;
}> = ({ children, doPulsate, isReady = true, sx, testId }) => {
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    const timeout = window.setTimeout(() => setIsRendered(true), 20);

    let interval: number;
    if (doPulsate) {
      interval = window.setInterval(() => {
        setIsRendered(false);
        window.setTimeout(() => setIsRendered(true), pulsateMs);
      }, 15000);
    }

    return () => {
      window.clearTimeout(timeout);
      window.clearInterval(interval);
    };
  }, [doPulsate, isReady]);

  return (
    <ContainerSection
      data-testid={testId}
      sx={{
        ...(sx ?? {}),
        opacity: isRendered ? 1 : 0,
        transitionDuration: `${doPulsate ? pulsateMs : fadeInMs}ms`,
      }}
    >
      {children}
    </ContainerSection>
  );
};

const ContainerSection = styled("section")`
  transition-property: opacity;
`;
