import { IEntry } from "./IEntry";
import { IJournal } from "./IJournal";
import { JournalType } from "./JournalType";
import { IJournalAttributes } from "./IJournalAttributes";
import { IAddJournalCommand } from "./commands/IAddJournalCommand";
import { IUpsertEntryCommand } from "./commands/IUpsertEntryCommand";
import { IEditJournalCommand } from "./commands/IEditJournalCommand";
import { envSettings } from "../env/envSettings";
import { IApiError } from "./IApiError";
import { ICommandResult } from "./ICommandResult";
import { IAuthResult } from "./IAuthResult";
import { IUser } from "./IUser";
import { getMillisecondsUntilRefresh } from "./authentication/tokenRefresh";
import { ApiError } from "./ApiError";
import { IUpdatePermissions } from "./IUpdatePermissions";
import { IJournalAttributeValues } from "./IJournalAttributeValues";
import { stringifyAttributeValues } from "./stringifyAttributeValues";
import { IDateConditions } from "../components/details/JournalContext";
import { IJournalThresholdDefinitions } from "./IJournalThresholdDefinitions";
import { LoadingHandler } from "./LoadingHandler";
import { IGetAllEntriesQueryResult } from "./IGetAllEntriesQueryResult";
import { ISearchEntitiesResult } from "./ISearchEntitiesResult";
import { IApiSystemInfo } from "./IApiSystemInfo";
import { IAdminUserItem } from "./IAdminUserItem";
import { IDeleteUserConfirmationResult } from "./IDeleteUserConfirmationResult";
import { LoginHandler } from "./LoginHandler";
import {
  IAddScheduleToEntryCommand,
  IAddScheduleToJournalCommand,
} from "./commands/IAddScheduleCommand";
import { IScheduleDefinition } from "./IScheduleDefinition";
import { ICleanupUserTagsCommandResult } from "./CleanupUserTagsResult";
import { ICleanupUserTagsCommand } from "./ICleanupUserTagsCommand";
import { StorageWrapper } from "../util/StorageWrapper";
import { IJournalCustomProps } from "./IJournalCustomProps";

type HttpMethod = "GET" | "PUT" | "POST" | "PATCH" | "DELETE";

// Serializes params to a query string (incl. the leading "?"), or an empty
// string when there are none. URLSearchParams percent-encodes keys and values,
// so search text containing "&", "#", "+" etc. no longer corrupts the request.
function toQueryString(params: URLSearchParams): string {
  const query = params.toString();
  return query ? `?${query}` : "";
}

export class ServerApi {
  private static _loginHandler = new LoginHandler(() =>
    ServerApi.tryToLoginAgain(),
  );

  static loadingHandler: LoadingHandler = new LoadingHandler();

  static e2eStorage = new StorageWrapper(localStorage);

  private static _jwtToken: string;
  private static _isE2eTest: boolean =
    ServerApi.e2eStorage.getValue<boolean>("isE2eTest") ?? false;

  static serverOs: "lin" | "win" = "lin";

  private static googlePrompt: () => void;

  private static onAuthenticated: (() => void) | null;

  private static refreshTimer: ReturnType<typeof setTimeout> | undefined;

  // The refresh token, like the access token, is only kept in memory (never
  // persisted), so a page reload re-authenticates via Google.
  private static _refreshToken: string | undefined;

  // De-dupes concurrent refreshes (e.g. several requests 401 at once).
  private static refreshInFlight: Promise<boolean> | null = null;

  static setGooglePrompt(googlePrompt: () => void) {
    ServerApi.googlePrompt = googlePrompt;
  }

  static async tryToLoginAgain(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (ServerApi.googlePrompt) {
        ServerApi.onAuthenticated = () => resolve();
        ServerApi.googlePrompt();
      } else {
        reject(
          new ApiError(401, {
            message: "Failed to login again as google prompt is not available.",
          }),
        );
      }
    });
  }

  static setServerOs(os: "lin" | "win"): void {
    ServerApi.serverOs = os;
  }

  static getServerOs() {
    return ServerApi.serverOs;
  }

  static async wakeMeUp(): Promise<void> {
    return await ServerApi.executeRequest<void>("/wake/me/up");
  }

  static async setUpForTests(jwtToken: string): Promise<IAuthResult> {
    ServerApi._jwtToken = jwtToken;

    ServerApi._isE2eTest = true;
    ServerApi.e2eStorage.setValue("isE2eTest", true);
    // In test mode the token IS persisted (unlike production) so the session
    // survives full page reloads, which the e2e tests rely on when navigating
    // to a URL directly via page.goto without the test-user query param.
    ServerApi.e2eStorage.setValue("e2eToken", jwtToken);

    const authResult = await ServerApi.executeRequest<IAuthResult>(
      "/auth/e2e",
      "POST",
    );

    this.handleAuthenticated(authResult);

    return authResult;
  }

  static isTestMode(): boolean {
    return ServerApi._isE2eTest;
  }

  static async restoreTestSession(): Promise<IUser> {
    ServerApi._jwtToken = ServerApi.e2eStorage.getValue<string>("e2eToken")!;

    return await ServerApi.executeRequest<IUser>("/user");
  }

  static async authenticate(token: string): Promise<IAuthResult> {
    const authResult: IAuthResult = await ServerApi.executeRequest(
      "/auth/google",
      "POST",
      { token: token },
    );

    this.handleAuthenticated(authResult);
    return authResult;
  }

  private static handleAuthenticated(authResult: IAuthResult) {
    ServerApi._jwtToken = authResult.jwtToken;
    ServerApi._refreshToken = authResult.refreshToken;

    ServerApi.scheduleTokenRefresh(authResult.expiresAt);

    ServerApi.onAuthenticated?.();
    ServerApi.onAuthenticated = null;
  }

  // Exchanges the in-memory refresh token for a fresh access token (and a
  // rotated refresh token) via a silent background request - no Google, no UI.
  // Returns false if there is no refresh token or the server rejects it, so the
  // caller can fall back to a full Google sign-in.
  static tryRefresh(): Promise<boolean> {
    if (!ServerApi._refreshToken) {
      return Promise.resolve(false);
    }

    ServerApi.refreshInFlight ??= ServerApi.doRefresh().finally(() => {
      ServerApi.refreshInFlight = null;
    });

    return ServerApi.refreshInFlight;
  }

  private static async doRefresh(): Promise<boolean> {
    try {
      const authResult = await ServerApi.executeRequest<IAuthResult>(
        "/auth/refresh",
        "POST",
        { refreshToken: ServerApi._refreshToken },
        true, // don't run the 401-refresh handler for the refresh call itself
      );

      ServerApi.handleAuthenticated(authResult);
      return true;
    } catch {
      // the refresh token is no longer usable; drop it so we go straight to
      // Google next time instead of retrying a dead token.
      ServerApi._refreshToken = undefined;
      return false;
    }
  }

  private static scheduleTokenRefresh(expiresAt: string | undefined) {
    if (ServerApi._isE2eTest || !expiresAt) {
      return;
    }

    if (ServerApi.refreshTimer) {
      clearTimeout(ServerApi.refreshTimer);
    }

    ServerApi.refreshTimer = setTimeout(() => {
      void ServerApi.tryRefresh().then((refreshed) => {
        // Refresh token expired/invalid (e.g. tab open longer than its
        // lifetime): fall back to Google. The reactive 401 handler is a
        // further safety net.
        if (!refreshed) {
          ServerApi.tryToLoginAgain().catch(() => {});
        }
      });
    }, getMillisecondsUntilRefresh(expiresAt));
  }

  static async addJournalToFavorites(journalId: string): Promise<void> {
    return await ServerApi.executeRequest(
      `/user/favorites/${journalId}`,
      "PATCH",
    );
  }

  static async removeJournalFromFavorites(journalId: string): Promise<void> {
    return await ServerApi.executeRequest(
      `/user/favorites/${journalId}`,
      "DELETE",
    );
  }

  static async getJournals(
    searchText?: string,
    journalTypes?: JournalType[],
    favoritesOnly?: boolean,
    journalIds?: string[],
  ): Promise<IJournal[]> {
    const paramsString = this.getParamsString(
      searchText,
      journalTypes,
      favoritesOnly,
      journalIds,
    );

    return await ServerApi.executeRequest(`/journals${paramsString}`);
  }

  static async getJournal(journalId: string): Promise<IJournal> {
    return await ServerApi.executeRequest(`/journals/${journalId}`);
  }

  static async getActiveEntry(journalId: string): Promise<IEntry> {
    return await ServerApi.executeRequest(
      `/entries/journal/${journalId}/active`,
    );
  }

  static async getEntry(entryId: string): Promise<IEntry> {
    return await ServerApi.executeRequest(`/entries/${entryId}`);
  }

  static async getAllEntries(
    searchText: string,
    journalTypes: JournalType[],
  ): Promise<IGetAllEntriesQueryResult> {
    const paramsString = this.getParamsString(searchText, journalTypes);
    return await ServerApi.executeRequest(`/entries${paramsString}`);
  }

  static async addJournal(
    name: string,
    description: string,
    type: JournalType,
  ): Promise<ICommandResult> {
    const payload: IAddJournalCommand = {
      name: name,
      description: description,
      type: type,
    };

    return await ServerApi.executeRequest("/journals", "POST", payload);
  }

  static async editJournal(
    journalId: string,
    name: string | undefined,
    description: string | undefined,
    notes: string | undefined,
    attributes: IJournalAttributes | undefined,
    thresholds: IJournalThresholdDefinitions | undefined,
    customProps: (Record<string, unknown> & IJournalCustomProps) | undefined,
  ): Promise<ICommandResult> {
    const payload: IEditJournalCommand = {
      journalId: journalId,
      name: name,
      description: description,
      notes: notes,
      attributes: attributes,
      thresholds: thresholds,
      customProps: customProps,
    };

    return await ServerApi.executeRequest("/journals/", "PUT", payload);
  }

  static async deleteJournal(journalId: string): Promise<ICommandResult> {
    return await ServerApi.executeRequest(`/journals/${journalId}/`, "DELETE");
  }

  static async modifyJournalPermissions(
    journalId: string,
    permissions: IUpdatePermissions,
  ): Promise<ICommandResult> {
    return await ServerApi.executeRequest(
      `/journals/${journalId}/permissions`,
      "PUT",
      permissions,
    );
  }

  static async modifyJournalSchedule(
    journalId: string | undefined,
    scheduleDefinition: IScheduleDefinition,
  ): Promise<ICommandResult> {
    const cmd: IAddScheduleToJournalCommand = {
      journalId,
      ...scheduleDefinition,
    };

    return await ServerApi.executeRequest(
      `/journals/${journalId}/schedule`,
      "POST",
      cmd,
    );
  }

  static async modifyEntrySchedule(
    entryId: string,
    scheduleDefinition: IScheduleDefinition,
  ): Promise<ICommandResult> {
    const cmd: IAddScheduleToEntryCommand = {
      entryId,
      ...scheduleDefinition,
    };

    return await ServerApi.executeRequest(
      `/entries/${entryId}/schedule`,
      "POST",
      cmd,
    );
  }

  static async getJournalEntries(
    journalId: string,
    attributeValues: IJournalAttributeValues,
    dateConditions: IDateConditions,
    searchText: string,
  ): Promise<IEntry[]> {
    const attributeValuesString = stringifyAttributeValues(attributeValues);

    const urlParams = new URLSearchParams();

    if (attributeValuesString) {
      urlParams.set("attributeValues", attributeValuesString);
    }

    if (dateConditions.from) {
      urlParams.set("fromDate", dateConditions.from.toISOString());
    }

    if (dateConditions.to) {
      urlParams.set("toDate", dateConditions.to.toISOString());
    }

    if (searchText) {
      urlParams.set("searchText", searchText);
    }

    const params = toQueryString(urlParams);

    return await ServerApi.executeRequest(
      `/entries/journal/${journalId}${params}`,
    );
  }

  static async upsertEntry(
    command: IUpsertEntryCommand,
    urlSegment: string,
  ): Promise<ICommandResult> {
    return await ServerApi.executeRequest(
      `/entries/${urlSegment}`,
      "POST",
      command,
    );
  }

  static async deleteEntry(entryId: string): Promise<ICommandResult> {
    return await ServerApi.executeRequest(
      `/entries/${entryId}`,
      "DELETE",
      null,
    );
  }

  static async moveEntry(entryId: string, targetJournalId: string) {
    return await ServerApi.executeRequest(
      `/entries/${entryId}/move/${targetJournalId}`,
      "PUT",
      null,
    );
  }

  static async getSystemInfo(): Promise<IApiSystemInfo> {
    return await ServerApi.executeRequest(`/system_info`, "GET", null);
  }

  static async getCurrentUser(): Promise<IUser> {
    return await ServerApi.executeRequest(`/user`, "GET", null);
  }

  static async getAdminUsersOverview(): Promise<IAdminUserItem[]> {
    return await ServerApi.executeRequest(`/admin/users`, "GET", null);
  }

  static async requestDeleteUserConfirmation(
    userId: string,
  ): Promise<IDeleteUserConfirmationResult> {
    return await ServerApi.executeRequest(
      `/admin/users/${userId}/delete-confirmation`,
      "POST",
    );
  }

  static async deleteAdminUser(
    userId: string,
    confirmationToken: string,
  ): Promise<ICommandResult> {
    return await ServerApi.executeRequest(`/admin/users/${userId}`, "DELETE", {
      userId: userId,
      confirmationToken: confirmationToken,
    });
  }

  static async updateUserTags(tagNames: Record<string, string>): Promise<void> {
    return await ServerApi.executeRequest("/user/tags", "PATCH", {
      tagNames: tagNames,
    });
  }

  static async updateJournalUserTags(
    journalId: string,
    tagIds: string[],
  ): Promise<void> {
    return await ServerApi.executeRequest(
      `/journals/${journalId}/tags`,
      "PATCH",
      {
        journalId: journalId,
        tagIds: tagIds,
      },
    );
  }

  static async cleanupUserTags(
    isDryRun: boolean,
  ): Promise<ICleanupUserTagsCommandResult> {
    return await ServerApi.executeRequest(`/user/tags/cleanup`, "POST", {
      dryRun: isDryRun,
    } as ICleanupUserTagsCommand);
  }

  static async searchEntities(
    searchText: string,
    scheduledOnly: boolean,
    onlyEntriesOfTypes: JournalType[],
    onlyConsiderTitle: boolean,
  ): Promise<ISearchEntitiesResult> {
    const urlParams = new URLSearchParams();

    if (searchText) {
      urlParams.set("searchText", searchText);
    }

    if (onlyConsiderTitle) {
      urlParams.set("onlyConsiderTitle", String(onlyConsiderTitle));
    }

    if (scheduledOnly) {
      urlParams.set("scheduledOnly", String(scheduledOnly));
    }

    if (onlyEntriesOfTypes?.length) {
      urlParams.set("onlyEntriesOfTypes", onlyEntriesOfTypes.join(","));
    }

    const params = toQueryString(urlParams);

    return await ServerApi.executeRequest(`/search/entities${params}`);
  }

  static async getRelatedEntities(
    entityId: string,
    entityType: "Journal" | "Entry",
  ): Promise<ISearchEntitiesResult> {
    const urlParams = new URLSearchParams();
    urlParams.set("entityId", entityId);
    urlParams.set("entityType", entityType);

    return await ServerApi.executeRequest(
      `/search/related${toQueryString(urlParams)}`,
    );
  }

  static async exportData() {
    return await ServerApi.executeRequest(`/user/export-data`, "GET");
  }

  static async sendTestNotification(): Promise<void> {
    return await ServerApi.executeRequest(
      `/notifications/send_test`,
      "POST",
      null,
    );
  }

  static async clearBackendCache(): Promise<void> {
    return await ServerApi.executeRequest(`/system_config/clear-cache`, "POST");
  }

  static async signOutOtherDevices(): Promise<void> {
    return await ServerApi.executeRequest(
      `/auth/revoke-refresh-tokens`,
      "POST",
      { refreshToken: ServerApi._refreshToken },
      true,
    );
  }

  static async executeRequest<T = void>(
    url: string,
    method: HttpMethod = "GET",
    payload: unknown = undefined,
    isRetry = false,
  ): Promise<T> {
    try {
      ServerApi.loadingHandler.oneMore();

      const start = performance.now();

      const response = await ServerApi.getResponse(url, method, payload);

      ServerApi.printPerfData(method, url, response, start);

      const text = await response.text();
      const json = text ? JSON.parse(text) : null;

      if (response.ok) {
        return json;
      }

      if (response.status === 401 && !isRetry) {
        // First try a silent refresh-token exchange; only if that fails fall
        // back to a full Google sign-in.
        if (await ServerApi.tryRefresh()) {
          return ServerApi.executeRequest(url, method, payload, true);
        }

        return this._loginHandler.loginAndRetry(() =>
          ServerApi.executeRequest(url, method, payload, true),
        );
      }

      throw new ApiError(response.status, json as IApiError);
    } finally {
      ServerApi.loadingHandler.oneLess();
    }
  }

  private static async getResponse(
    url: string,
    method: HttpMethod,
    payload: unknown,
  ) {
    const requestConfig: RequestInit = {
      method: method,
      body: payload ? JSON.stringify(payload) : null,
      headers: this.getHeaders(),
    };

    return await fetch(new Request(this.getBaseUrl() + url), requestConfig);
  }

  private static getHeaders() {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (ServerApi._jwtToken) {
      headers["Authorization"] = "Bearer " + ServerApi._jwtToken;
    }
    return headers;
  }

  private static getParamsString(
    searchText: string | undefined,
    journalTypes: JournalType[] | undefined,
    favoritesOnly?: boolean,
    journalIds?: string[],
  ) {
    const params = new URLSearchParams();

    if (searchText) {
      params.set("searchText", searchText);
    }

    if (journalTypes?.length) {
      params.set("journalTypes", journalTypes.join(","));
    }

    if (favoritesOnly) {
      params.set("favoritesOnly", "true");
    }

    if (journalIds?.length) {
      params.set("journalIds", journalIds.join(","));
    }

    return toQueryString(params);
  }

  private static getBaseUrl() {
    if (ServerApi._isE2eTest) {
      return "http://localhost:5072/api";
    }

    return ServerApi.serverOs === "win"
      ? envSettings.apiBaseUrlWindows
      : envSettings.apiBaseUrlLinux;
  }

  private static printPerfData(
    method: HttpMethod,
    url: string,
    response: Response,
    start: number,
  ) {
    if (!envSettings.isDev) {
      return;
    }

    const total = Math.round(performance.now() - start);
    const server = Number(response.headers.get("server-action-duration"));
    const network = total - server;
    const status = response.status;

    console.info(
      `ServerApi: ${method} ${url} (${ServerApi.serverOs}) [${status}]: Server ${server} + Network ${network} = Total ${total} `,
    );
  }
}
