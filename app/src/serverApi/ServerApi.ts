import { IMeasurement } from "./IMeasurement";
import { IMetric } from "./IMetric";
import { MetricType } from "./MetricType";
import { IMetricAttributes } from "./IMetricAttributes";
import { IAddMetricCommand } from "./commands/IAddMetricCommand";
import { IUpsertMeasurementCommand } from "./commands/IUpsertMeasurementCommand";
import { IEditMetricCommand } from "./commands/IEditMetricCommand";
import { envSettings } from "../env/envSettings";
import { IApiError } from "./IApiError";
import { ICommandResult } from "./ICommandResult";
import { IAuthResult } from "./IAuthResult";
import { IUser } from "./IUser";
import { AuthStorage } from "./authentication/AuthStorage";
import { ApiError } from "./ApiError";
import { ISystemInfo } from "./ISystemInfo";
import { IUpdatePermissions } from "./IUpdatePermissions";
import { IMetricAttributeValues } from "./IMetricAttributeValues";
import { stringifyAttributeValues } from "./stringifyAttributeValues";
import { IDateConditions } from "../components/details/MetricDetailsContext";
import { toDateOnlyIsoString } from "../util/utils";
import { IAttributeSearchResult } from "./IAttributeSearchResult";
import { IThresholdValues } from "./IThresholdValues";
import { IMetricThresholds } from "./IMetricThresholds";
import { IMetricUiSettings } from "../components/details/edit/MetricUiSettings";
import { LoadingHandler } from "./LoadingHandler";
import { IGetActivitiesQueryResult } from "./IGetActivitiesQueryResult";

type HttpMethod = "GET" | "PUT" | "POST" | "DELETE";

export class ServerApi {
  private static _jwtToken: string;

  static serverOs: "lin" | "win" = "lin";

  static loadingHandler: LoadingHandler = new LoadingHandler();

  private static googlePrompt: () => Promise<{ isSuccess: boolean }>;
  private static onAuthenticated: () => void;

  static setGooglePrompt(googlePrompt: () => Promise<{ isSuccess: boolean }>) {
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
          })
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

  static async authenticate(token: string): Promise<IAuthResult> {
    const authResult: IAuthResult = await ServerApi.executeRequest(
      "/auth/google",
      "POST",
      { token: token }
    );

    new AuthStorage().setAuthResult(authResult);

    ServerApi._jwtToken = authResult.jwtToken;

    ServerApi.onAuthenticated?.();
    ServerApi.onAuthenticated = null;

    return authResult;
  }

  static async getMetrics(
    searchText?: string,
    metricTypes?: MetricType[]
  ): Promise<IMetric[]> {
    const paramsString = this.getParamsString(searchText, metricTypes);
    return await ServerApi.executeRequest(`/metrics${paramsString}`);
  }

  static async getMetric(metricId: string): Promise<IMetric> {
    return await ServerApi.executeRequest(`/metrics/${metricId}`);
  }

  static async getActiveMeasurement(metricId: string): Promise<IMeasurement> {
    return await ServerApi.executeRequest(`/measurements/${metricId}/active`);
  }

  static async getActivities(
    searchText: string,
    metricTypes: MetricType[]
  ): Promise<IGetActivitiesQueryResult> {
    const paramsString = this.getParamsString(searchText, metricTypes);
    return await ServerApi.executeRequest(`/activities${paramsString}`);
  }

  static async addMetric(
    name: string,
    description: string,
    type: MetricType
  ): Promise<ICommandResult> {
    const payload: IAddMetricCommand = {
      name: name,
      description: description,
      type: type,
    };

    return await ServerApi.executeRequest("/metrics", "POST", payload);
  }

  static async editMetric(
    metricId: string,
    name: string,
    description: string,
    notes: string,
    attributes: IMetricAttributes,
    thresholds: IMetricThresholds,
    uiSettings: IMetricUiSettings | string
  ): Promise<ICommandResult> {
    const payload: IEditMetricCommand = {
      metricId: metricId,
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

    return await ServerApi.executeRequest("/metrics/", "PUT", payload);
  }

  static async deleteMetric(metricId: string): Promise<unknown> {
    return await ServerApi.executeRequest(`/metrics/${metricId}/`, "DELETE");
  }

  static async modifyMetricPermissions(
    metricId: string,
    permissions: IUpdatePermissions
  ): Promise<unknown> {
    return await ServerApi.executeRequest(
      `/metrics/${metricId}/permissions`,
      "PUT",
      permissions
    );
  }

  static async getThresholdValues(
    metricId: string,
    dateConditions: IDateConditions
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
      `/metrics/${metricId}/threshold_values${params}`
    );
  }

  static async getMeasurements(
    metricId: string,
    attributeValues: IMetricAttributeValues,
    dateConditions: IDateConditions
  ): Promise<IMeasurement[]> {
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

    return await ServerApi.executeRequest(`/measurements/${metricId}${params}`);
  }

  static async upsertMeasurement(
    command: IUpsertMeasurementCommand,
    urlSegment: string
  ): Promise<ICommandResult> {
    return await ServerApi.executeRequest(
      `/measurements/${urlSegment}`,
      "POST",
      command
    );
  }

  static async deleteMeasurement(measurementId: string): Promise<void> {
    return await ServerApi.executeRequest(
      `/measurements/${measurementId}`,
      "DELETE",
      null
    );
  }

  static async moveMeasurement(measurementId: string, targetMetricId: string) {
    return await ServerApi.executeRequest(
      `/measurements/${measurementId}/move${targetMetricId}`,
      "PUT",
      null
    );
  }

  static async searchMetricAttributes(
    metricId: string,
    searchText: string
  ): Promise<IAttributeSearchResult[]> {
    return await ServerApi.executeRequest(
      `/search/metric_attributes/${metricId}?searchText=${searchText}`,
      "GET",
      null
    );
  }

  static async searchMeasurements(searchText: string): Promise<IMeasurement[]> {
    return await ServerApi.executeRequest(
      `/search/measurements?searchText=${searchText}`,
      "GET",
      null
    );
  }

  static async getSystemInfo(): Promise<ISystemInfo> {
    return await ServerApi.executeRequest(`/system_info`, "GET", null);
  }

  static async executeRequest<T = void>(
    url: string,
    method: HttpMethod = "GET",
    payload: unknown = undefined,
    isRetry = false
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
        try {
          ServerApi.loadingHandler.oneMore();
          await ServerApi.tryToLoginAgain();
          return await ServerApi.executeRequest(url, method, payload, true);
        } finally {
          ServerApi.loadingHandler.oneLess();
        }
      }

      throw new ApiError(response.status, json as IApiError);
    } finally {
      ServerApi.loadingHandler.oneLess();
    }
  }

  private static async getResponse(
    url: string,
    method: HttpMethod,
    payload: unknown
  ) {
    const headers: { [key: string]: string } = {
      "Content-Type": "application/json",
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
    metricTypes: MetricType[]
  ) {
    const params: string[] = [];

    if (searchText) {
      params.push(`searchText=${searchText}`);
    }

    if (metricTypes?.length) {
      params.push(`metricTypes=${metricTypes.join(",")}`);
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
    start: number
  ) {
    const total = Math.round(performance.now() - start);
    const server = Number(response.headers.get("server-action-duration"));
    const network = total - server;
    const status = response.status;

    console.info(
      `-- ${method} ${url} (${ServerApi.serverOs}) [${status}]: Server ${server} + Network ${network} = Total ${total} `
    );
  }
}
