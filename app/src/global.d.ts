// required for "import.meta.env...r "
import "vite/client";

import "google-one-tap";

declare global {
  const google: typeof import("google-one-tap");
}
