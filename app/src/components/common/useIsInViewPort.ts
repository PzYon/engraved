import { useEffect, useState } from "react";

// credits: https://bobbyhadz.com/blog/react-check-if-element-in-viewport

// Takes the element itself and not a ref to it, so that observing starts when
// the element appears - and no observer is created for as long as there is none.
export function useIsInViewport(element: Element | null) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(([entry]) =>
      setIsIntersecting(entry.isIntersecting),
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [element]);

  return isIntersecting;
}
