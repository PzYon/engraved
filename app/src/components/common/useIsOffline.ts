import { useEffect, useState } from "react";

// Tracks the browser's online/offline state. Used to render offline-specific
// UI (header indicator, "data not available offline" placeholders). Note that
// navigator.onLine only knows about the network interface - it cannot detect
// an unreachable server.
export function useIsOffline(): boolean {
  const [isOffline, setIsOffline] = useState(
    typeof navigator !== "undefined" ? !navigator.onLine : false,
  );

  useEffect(() => {
    const update = () => setIsOffline(!navigator.onLine);

    window.addEventListener("online", update);
    window.addEventListener("offline", update);

    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  return isOffline;
}
