import React, { useEffect, useState } from "react";
import { css, styled } from "@mui/material";
import { Position } from "./actions/Position";

export const StickTo: React.FC<{
  isDisabled?: boolean;
  position: Position;
  render: (isStuck: boolean) => React.ReactNode;
}> = ({ isDisabled, position, render }) => {
  const [isStuck, setIsStuck] = useState(false);
  const sentinelRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isDisabled || !sentinelRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setIsStuck(!entry.isIntersecting),
      { threshold: [1] },
    );

    observer.observe(sentinelRef.current);

    return () => {
      observer.disconnect();
    };
  }, [isDisabled, position]);

  if (isDisabled) {
    return <>{render(false)}</>;
  }

  return (
    <>
      {position === "top" && <Sentinel ref={sentinelRef} />}
      <Host stickToView={!isDisabled} position={position}>
        {render(isStuck)}
      </Host>
      {position === "bottom" && <Sentinel ref={sentinelRef} />}
    </>
  );
};

const Sentinel = styled("div")`
  height: 1px;
  visibility: hidden;
  pointer-events: none;
`;

const Host = styled("div")<{
  stickToView?: boolean;
  position: Position;
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
