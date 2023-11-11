import { MutableRefObject, useEffect, useMemo, useState } from "react";

// credits: https://bobbyhadz.com/blog/react-check-if-element-in-viewport

export function useIsInViewport(ref: MutableRefObject<HTMLDivElement>) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  const observer = useMemo(
    () =>
      new IntersectionObserver(([entry]) =>
        setIsIntersecting(entry.isIntersecting),
      ),
    [],
  );

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    observer.observe(ref.current);

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref.current, observer]);

  return isIntersecting;
}
