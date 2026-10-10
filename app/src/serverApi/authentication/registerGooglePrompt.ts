import { envSettings } from "../../env/envSettings";
import { ServerApi } from "../ServerApi";
import { CredentialResponse, GsiButtonConfiguration } from "google-one-tap";

const scriptUrl = "https://accounts.google.com/gsi/client";

// Loads Google's script and sets sign-in up with it. Given an element, it also
// renders Google's button into it and starts the silent prompt right away.
// Without one, nothing is shown: starting the prompt - and offering a button
// should it not appear - is then up to the caller, for which
// ServerApi.tryToLoginAgain() is the way to go.
export function registerGooglePrompt(
  signInWithJwt: (response: CredentialResponse) => void,
  domElement: HTMLElement | null,
): Promise<void> {
  return loadGoogleScript().then(() => {
    google.accounts.id.initialize({
      client_id: envSettings.auth.google.clientId,
      callback: signInWithJwt,
      auto_select: true,
      use_fedcm_for_prompt: true,
    });

    ServerApi.setGooglePrompt(googlePrompt);

    if (!domElement) {
      return;
    }

    // With FedCM the prompt no longer reports display-moment status
    // (isNotDisplayed()/isSkippedMoment() are deprecated and emit
    // [GSI_LOGGER] warnings), so we render the button unconditionally as a
    // fallback and let the browser decide whether to show One Tap.
    renderGoogleSignInButton(domElement);

    googlePrompt();
  });
}

const defaultButtonConfig: GsiButtonConfiguration = {
  theme: "outline",
  size: "large",
  shape: "pill",
};

// Renders the regular Google sign-in button into the given element. Unlike
// One Tap, a button the user clicks is never silently suppressed by the
// browser, which makes it the reliable way back in when the silent prompt does
// not show. Requires google.accounts.id.initialize() to have run.
export function renderGoogleSignInButton(
  domElement: HTMLElement,
  config: GsiButtonConfiguration = defaultButtonConfig,
): void {
  if (typeof google === "undefined") {
    return;
  }

  // Rendering is idempotent: drop a previously rendered button first, so a
  // re-render (e.g. React strict mode) does not leave two of them behind.
  domElement.replaceChildren();

  google.accounts.id.renderButton(domElement, config);
}

function loadGoogleScript(): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    if (getGoogleScriptTag()) {
      // Script already present (e.g. a second registration): resolve instead of
      // leaving the promise - and the prompt-registration chain - pending forever.
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = scriptUrl;
    script.onload = () => resolve();
    script.onerror = () => {
      // Not left behind: it would make the next attempt believe that the script
      // has been loaded.
      script.remove();
      reject(new Error("Failed to load the Google sign-in script."));
    };

    document.body.appendChild(script);
  });
}

function getGoogleScriptTag() {
  return document.querySelector(`script[src="${scriptUrl}"]`);
}

function googlePrompt(): void {
  google.accounts.id.prompt();
}
