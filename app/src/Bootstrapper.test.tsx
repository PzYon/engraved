import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { CredentialResponse } from "google-one-tap";
import { Bootstrapper } from "./Bootstrapper";
import { ServerApi } from "./serverApi/ServerApi";
import { IAuthResult } from "./serverApi/IAuthResult";
import { IUser } from "./serverApi/IUser";
import { getLastUser, setLastUser } from "./serverApi/authentication/lastUser";

// Stands in for Google: hands the test the callback a completed sign-in calls.
const google = vi.hoisted(() => ({
  signIn: undefined as ((response: CredentialResponse) => void) | undefined,
  buttonHost: undefined as HTMLElement | null | undefined,
}));

vi.mock("./serverApi/authentication/registerGooglePrompt", () => ({
  registerGooglePrompt: (
    signInWithJwt: (response: CredentialResponse) => void,
    domElement: HTMLElement | null,
  ) => {
    google.signIn = signInWithJwt;
    google.buttonHost = domElement;
    return Promise.resolve();
  },
}));

// The real app minus everything below its context, which is all that matters
// here: who it is rendered for.
vi.mock("./App", async () => {
  const { AppContextProvider } = await import("./AppContextProvider");
  const { useAppContext } = await import("./AppContext");

  const CurrentUser = () => <div>app of {useAppContext().user.name}</div>;

  return {
    App: ({ user }: { user: IUser }) => (
      <AppContextProvider user={user}>
        <CurrentUser />
      </AppContextProvider>
    ),
  };
});

function completeSignInAs(user: IUser) {
  vi.spyOn(ServerApi, "authenticate").mockResolvedValue({
    user,
  } as IAuthResult);

  return act(async () => {
    google.signIn!({ credential: "google-credential" } as CredentialResponse);
  });
}

describe("Bootstrapper", () => {
  beforeEach(() => {
    localStorage.clear();
    google.signIn = undefined;
    google.buttonHost = undefined;

    vi.spyOn(ServerApi, "tryToLoginAgain").mockResolvedValue();
  });

  it("shows the welcome page until somebody has signed in", async () => {
    render(<Bootstrapper />);

    expect(screen.getByText("engraved.")).toBeTruthy();
    expect(screen.queryByText(/app of/)).toBeNull();
    expect(google.buttonHost).toBeInstanceOf(HTMLElement);

    await completeSignInAs({ id: "user-id", name: "Ada" });

    expect(screen.getByText("app of Ada")).toBeTruthy();
  });

  it("remembers who has signed in", async () => {
    render(<Bootstrapper />);

    await completeSignInAs({ id: "user-id", name: "Ada" });

    expect(getLastUser()).toEqual({ id: "user-id", name: "Ada" });
  });

  it("starts the app for the remembered user without waiting for the sign-in", async () => {
    setLastUser({ id: "user-id", name: "Ada" });

    render(<Bootstrapper />);

    expect(screen.getByText("app of Ada")).toBeTruthy();
    expect(screen.queryByText("engraved.")).toBeNull();

    // ... which is started nonetheless, silently and without Google's button
    await act(async () => {});

    expect(google.buttonHost).toBeNull();
    expect(ServerApi.tryToLoginAgain).toHaveBeenCalled();
  });

  it("replaces the remembered user with the one the sign-in returned", async () => {
    setLastUser({ id: "user-id", name: "Ada" });

    render(<Bootstrapper />);

    await completeSignInAs({ id: "user-id", name: "Ada Lovelace" });

    expect(screen.getByText("app of Ada Lovelace")).toBeTruthy();
    expect(getLastUser()?.name).toBe("Ada Lovelace");
  });
});
