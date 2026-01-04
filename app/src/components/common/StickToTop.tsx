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
        setIsStuck(!entry.isIntersecting);
      },
      { threshold: [1] },
    );

    const sentinel = createSentinelObject();
    stickyRef.current.prepend(sentinel);
    observer.observe(sentinel);

    return () => {
      observer.disconnect();
      sentinel.remove();
    };
  }, [isDisabled, isStuck, setIsStuck, stickyRef]);

  if (isDisabled) {
    return render(false);
  }

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

function createSentinelObject() {
  const sentinel = document.createElement("div");
  sentinel.style.position = "absolute";
  sentinel.style.top = "-1px";
  sentinel.style.height = "1px";
  sentinel.style.width = "1px";
  return sentinel;
}
