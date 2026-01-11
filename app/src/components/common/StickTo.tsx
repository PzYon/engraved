import React, { useEffect, useState } from "react";
import { css, styled } from "@mui/material";

export const StickTo: React.FC<{
  isDisabled?: boolean;
  position: "top" | "bottom";
  stickyRef: React.RefObject<HTMLElement>;
  render: (isStuck: boolean) => React.ReactNode;
}> = ({ isDisabled, position, stickyRef, render }) => {
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

  return (
    <Host stickToView={!isDisabled} position={position}>
      {render(isStuck)}
    </Host>
  );
};

const Host = styled("div")<{
  stickToView?: boolean;
  position: "top" | "bottom";
}>`
  ${(p) => {
    if (!p.stickToView) {
      return undefined;
    }

    if (p.position === "top") {
      return css`
        position: sticky;
        top: 0;
        z-index: 1000;
      `;
    }

    return css`
      position: sticky;
      bottom: 0;
      z-index: 1000;
    `;
  }}
`;

function createSentinelObject() {
  const sentinel = document.createElement("div");
  sentinel.style.position = "absolute";
  sentinel.style.top = "-1px";
  sentinel.style.height = "1px";
  sentinel.style.width = "1px";
  return sentinel;
}
