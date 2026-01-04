import React, { useEffect, useState } from "react";
import { css, styled } from "@mui/material";

export const StickToTop: React.FC<{
  isDisabled?: boolean;
  stickyRef: React.RefObject<HTMLElement>;
  render: (isStuck: boolean) => React.ReactNode;
}> = ({ isDisabled, stickyRef, render }) => {
  const [isStuck, setIsStuck] = useState(false);

  useEffect(() => {
    if (isDisabled || !stickyRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        // When the sentinel is not intersecting, the sticky element is stuck
        setIsStuck(!entry.isIntersecting);
      },
      { threshold: [1] },
    );

    // Create a sentinel element just above the sticky element
    const sentinel = document.createElement("div");
    sentinel.style.position = "absolute";
    sentinel.style.top = "-1px";
    sentinel.style.height = "1px";
    sentinel.style.width = "1px";
    stickyRef.current.prepend(sentinel);

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
      sentinel.remove();
    };
  }, [isDisabled, isStuck, setIsStuck, stickyRef]);

  return <Host stickToView={!isDisabled}>{render(isStuck)}</Host>;
};

const Host = styled("div")<{ stickToView?: boolean }>`
  ${(p) =>
    p.stickToView
      ? css`
          position: sticky;
          top: 0;
          z-index: 1000;
        `
      : undefined}
`;
