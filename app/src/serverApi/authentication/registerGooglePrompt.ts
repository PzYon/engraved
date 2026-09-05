import { envSettings } from "../../env/envSettings";
import { ServerApi } from "../ServerApi";
import { CredentialResponse } from "google-one-tap";

const scriptUrl = "https://accounts.google.com/gsi/client";

export function registerGooglePrompt(
  signInWithJwt: (response: CredentialResponse) => void,
  domElement: HTMLElement | null,
  doNotPrompt = false,
) {
  if (!domElement) {
    return undefined;
  }

  loadGoogleScript()
    .then(() => {
      google.accounts.id.initialize({
        client_id: envSettings.auth.google.clientId,
        callback: signInWithJwt,
        auto_select: true,
        use_fedcm_for_prompt: true,
      });

      ServerApi.setGooglePrompt(googlePrompt);

      if (doNotPrompt) {
        return;
      }

      // With FedCM the prompt no longer reports display-moment status
      // (isNotDisplayed()/isSkippedMoment() are deprecated and emit
      // [GSI_LOGGER] warnings), so we render the button unconditionally as a
      // fallback and let the browser decide whether to show One Tap.
      renderGoogleSignInButton(domElement);

      googlePrompt();
    })
    .catch(console.error);

  return unloadGoogleScript;
}

// Renders the regular Google sign-in button into the given element. Unlike
// One Tap, a button the user clicks is never silently suppressed by the
// browser, which makes it the reliable way back in when the silent prompt does
// not show. Requires google.accounts.id.initialize() to have run.
export function renderGoogleSignInButton(domElement: HTMLElement): void {
  if (typeof google === "undefined") {
    return;
  }

  // Rendering is idempotent: drop a previously rendered button first, so a
  // re-render (e.g. React strict mode) does not leave two of them behind.
  domElement.replaceChildren();

  google.accounts.id.renderButton(domElement, {
    theme: "outline",
    size: "large",
    shape: "pill",
  });
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
    script.onerror = reject;

    document.body.appendChild(script);
  });
}

function unloadGoogleScript() {
  const script = getGoogleScriptTag();
  if (script) {
    document.body.removeChild(script);
  }
}

function getGoogleScriptTag() {
  return document.querySelector(`script[src="${scriptUrl}"]`);
}

function googlePrompt(): void {
  google.accounts.id.prompt();
}
