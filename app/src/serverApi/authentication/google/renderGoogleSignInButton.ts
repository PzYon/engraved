import { GoogleInitializeResponse } from "./GoogleTypes";
import { envSettings } from "../../../env/envSettings";

const scriptUrl = "https://accounts.google.com/gsi/client";

export function renderGoogleSignInButton(
  signInWithJwt: (response: GoogleInitializeResponse) => void,
  domElement: HTMLElement
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
      });

      google.accounts.id.renderButton(domElement, {
        theme: "outline",
        size: "large",
        shape: "pill",
        type: "standard",
      });

      google.accounts.id.prompt();
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
