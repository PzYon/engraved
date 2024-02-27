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
import { AuthStorage } from "./authentication/AuthStorage";
import { ApiError } from "./ApiError";
import { IUpdatePermissions } from "./IUpdatePermissions";
import { IJournalAttributeValues } from "./IJournalAttributeValues";
import { stringifyAttributeValues } from "./stringifyAttributeValues";
import { IDateConditions } from "../components/details/JournalContext";
import { toDateOnlyIsoString } from "../util/utils";
import { IThresholdValues } from "./IThresholdValues";
import { IJournalThresholds } from "./IJournalThresholds";
import { LoadingHandler } from "./LoadingHandler";
import { IGetAllEntriesQueryResult } from "./IGetAllEntriesQueryResult";
import { ISearchEntitiesResult } from "./ISearchEntitiesResult";
import { IJournalUiSettings } from "../components/details/edit/IJournalUiSettings";
import { IApiSystemInfo } from "./IApiSystemInfo";
import { LoginHandler } from "./LoginHandler";

type HttpMethod = "GET" | "PUT" | "POST" | "PATCH" | "DELETE";

export class ServerApi {
  private static _loginHandler = new LoginHandler(() =>
    ServerApi.tryToLoginAgain(),
  );

  private static _jwtToken: string;

  static serverOs: "lin" | "win" = "lin";

  static loadingHandler: LoadingHandler = new LoadingHandler();

  private static googlePrompt: () => Promise<{
    isSuccess: boolean;
  }>;

  private static onAuthenticated: () => void;

  static setGooglePrompt(
    googlePrompt: () => Promise<{
      isSuccess: boolean;
    }>,
  ) {
    ServerApi.googlePrompt = googlePrompt;
  }

  static async tryToLoginAgain(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (ServerApi.googlePrompt) {
        ServerApi.googlePrompt()
          .then(() => (ServerApi.onAuthenticated = () => resolve()))
          .catch(reject);
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

  static async tryAuthenticate(token: string): Promise<IUser> {
    ServerApi._jwtToken = token;

    return await ServerApi.executeRequest<IUser>("/user");
  }

  static async authenticateForTests(jwtToken: string): Promise<IAuthResult> {
    ServerApi._jwtToken = jwtToken;

    const authResult = await ServerApi.executeRequest<IAuthResult>(
      "/auth/e2e",
      "POST",
    );

    this.handleAuthenticated(authResult);
    return authResult;
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
    new AuthStorage().setAuthResult(authResult);

    ServerApi._jwtToken = authResult.jwtToken;

    ServerApi.onAuthenticated?.();
    ServerApi.onAuthenticated = null;
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
  ): Promise<IJournal[]> {
    const paramsString = this.getParamsString(
      searchText,
      journalTypes,
      favoritesOnly,
    );
    return await ServerApi.executeRequest(`/journals${paramsString}`);
  }

  static async getJournal(journalId: string): Promise<IJournal> {
    return await ServerApi.executeRequest(`/journals/${journalId}`);
  }

  static async getActiveEntry(journalId: string): Promise<IEntry> {
    return await ServerApi.executeRequest(`/entries/${journalId}/active`);
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
    name: string,
    description: string,
    notes: string,
    attributes: IJournalAttributes,
    thresholds: IJournalThresholds,
    uiSettings: IJournalUiSettings | string,
  ): Promise<ICommandResult> {
    const payload: IEditJournalCommand = {
      journalId: journalId,
      name: name,
      description: description,
      notes: notes,
      attributes: attributes,
      thresholds: thresholds,
      customProps: {
        uiSettings:
          typeof uiSettings === "string"
            ? uiSettings
            : JSON.stringify(uiSettings),
      },
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
    journalId: string,
    date?: Date,
  ): Promise<ICommandResult> {
    return await ServerApi.executeRequest(
      `/journals/${journalId}/schedule`,
      "POST",
      {
        journalId: journalId,
        nextOccurrence: date,
      },
    );
  }

  static async modifyEntrySchedule(
    entryId: string,
    date?: Date,
  ): Promise<ICommandResult> {
    return await ServerApi.executeRequest(
      `/entries/${entryId}/schedule`,
      "POST",
      {
        entryId: entryId,
        nextOccurrence: date,
      },
    );
  }

  static async getThresholdValues(
    journalId: string,
    dateConditions: IDateConditions,
  ): Promise<IThresholdValues> {
    const urlParams: string[] = [];

    if (dateConditions?.from) {
      urlParams.push(`fromDate=${toDateOnlyIsoString(dateConditions.from)}`);
    }

    if (dateConditions?.to) {
      urlParams.push(`toDate=${toDateOnlyIsoString(dateConditions.to)}`);
    }

    const params = urlParams.length ? `?${urlParams.join("&")}` : "";

    return await ServerApi.executeRequest(
      `/journals/${journalId}/threshold_values${params}`,
    );
  }

  static async getJournalEntries(
    journalId: string,
    attributeValues: IJournalAttributeValues,
    dateConditions: IDateConditions,
  ): Promise<IEntry[]> {
    const attributeValuesString = stringifyAttributeValues(attributeValues);

    const urlParams: string[] = [];

    if (attributeValuesString) {
      urlParams.push(`attributeValues=${attributeValuesString}`);
    }

    if (dateConditions.from) {
      urlParams.push(`fromDate=${toDateOnlyIsoString(dateConditions.from)}`);
    }

    if (dateConditions.to) {
      urlParams.push(`toDate=${toDateOnlyIsoString(dateConditions.to)}`);
    }

    const params = urlParams.length ? `?${urlParams.join("&")}` : "";

    return await ServerApi.executeRequest(`/entries/${journalId}${params}`);
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

  static async getSearchEntities(
    searchText: string,
    scheduledOnly: boolean,
  ): Promise<ISearchEntitiesResult> {
    const urlParams: string[] = [];

    if (searchText) {
      urlParams.push(`searchText=${searchText}`);
    }

    if (scheduledOnly) {
      urlParams.push(`scheduledOnly=${scheduledOnly}`);
    }

    const params = urlParams.length ? `?${urlParams.join("&")}` : "";

    return await ServerApi.executeRequest(`/search/entities${params}`);
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
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "Accept-Encoding": "gzip, deflate, br",
    };

    if (ServerApi._jwtToken) {
      headers["Authorization"] = "Bearer " + ServerApi._jwtToken;
    }

    const requestConfig: RequestInit = {
      method: method,
      body: payload ? JSON.stringify(payload) : null,
      headers: headers,
    };

    return await fetch(new Request(this.getBaseUrl() + url), requestConfig);
  }

  private static getParamsString(
    searchText: string,
    journalTypes: JournalType[],
    favoritesOnly?: boolean,
  ) {
    const params: string[] = [];

    if (searchText) {
      params.push(`searchText=${searchText}`);
    }

    if (journalTypes?.length) {
      params.push(`journalTypes=${journalTypes.join(",")}`);
    }

    if (favoritesOnly) {
      params.push(`favoritesOnly=true`);
    }

    return params.length ? `?${params.join("&")}` : "";
  }

  private static getBaseUrl() {
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
    const total = Math.round(performance.now() - start);
    const server = Number(response.headers.get("server-action-duration"));
    const network = total - server;
    const status = response.status;

    console.info(
      `-- ${method} ${url} (${ServerApi.serverOs}) [${status}]: Server ${server} + Network ${network} = Total ${total} `,
    );
  }
}
