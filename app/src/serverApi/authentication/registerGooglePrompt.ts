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
      google.accounts.id.renderButton(domElement, {
        theme: "outline",
        size: "large",
        shape: "pill",
      });

      googlePrompt();
    })
    .catch(console.error);

  return unloadGoogleScript;
}

function loadGoogleScript(): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    if (getGoogleScriptTag()) {
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
