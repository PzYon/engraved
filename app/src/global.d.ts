// required for "import.meta.env...r "
import "vite/client";

import "@types/google-one-tap";

declare global {
  const google: typeof import("google-one-tap");
}
