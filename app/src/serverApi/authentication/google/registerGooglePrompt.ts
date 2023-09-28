import { GoogleInitializeResponse, GoogleNotification } from "./GoogleTypes";
import { envSettings } from "../../../env/envSettings";
import { ServerApi } from "../../ServerApi";

const scriptUrl = "https://accounts.google.com/gsi/client";

export function registerGooglePrompt(
  signInWithJwt: (response: GoogleInitializeResponse) => void,
  domElement: HTMLElement,
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
      });

      const googlePrompt = function (): Promise<{ isSuccess: boolean }> {
        return new Promise((resolve) => {
          google.accounts.id.prompt((n: GoogleNotification) => {
            resolve({ isSuccess: !n.isNotDisplayed() && !n.isSkippedMoment() });
          });
        });
      };

      ServerApi.setGooglePrompt(googlePrompt);

      if (doNotPrompt) {
        return;
      }

      googlePrompt().then((result: { isSuccess: boolean }) => {
        if (result.isSuccess) {
          return;
        }

        google.accounts.id.renderButton(domElement, {
          theme: "outline",
          size: "large",
          shape: "pill",
          type: "standard",
        });
      });
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
