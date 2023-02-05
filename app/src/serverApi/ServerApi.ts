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

type HttpMethod = "GET" | "PUT" | "POST" | "DELETE";

export class ServerApi {
  private static _jwtToken: string;
  private static _loadingCounter = 0;
  private static _timer: unknown;

  private static onLoadingToggle: (loading: boolean) => void;

  static registerOnLoadingToggle(onToggle: (loading: boolean) => void): void {
    ServerApi.onLoadingToggle = onToggle;
  }

  static async wakeMeUp(): Promise<void> {
    return await this.executeRequest<void>("/wake/me/up");
  }

  static async tryAuthenticate(token: string): Promise<IUser> {
    this._jwtToken = token;

    return await this.executeRequest<IUser>("/user");
  }

  static async authenticate(token: string): Promise<IAuthResult> {
    const authResult: IAuthResult = await this.executeRequest(
      "/auth/google",
      "POST",
      { token: token }
    );

    new AuthStorage().setAuthResult(authResult);

    this._jwtToken = authResult.jwtToken;

    return authResult;
  }

  static async getMetrics(): Promise<IMetric[]> {
    return await this.executeRequest(`/metrics/`);
  }

  static async getMetric(metricId: string): Promise<IMetric> {
    return await this.executeRequest(`/metrics/${metricId}`);
  }

  static async getActiveMeasurement(metricId: string): Promise<IMeasurement> {
    return await this.executeRequest(`/measurements/${metricId}/active`);
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

    return await this.executeRequest("/metrics", "POST", payload);
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

    return await this.executeRequest("/metrics/", "PUT", payload);
  }

  static async deleteMetric(metricId: string): Promise<unknown> {
    return await this.executeRequest(`/metrics/${metricId}/`, "DELETE");
  }

  static async modifyMetricPermissions(
    metricId: string,
    permissions: IUpdatePermissions
  ): Promise<unknown> {
    return await this.executeRequest(
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

    return await this.executeRequest(
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

    return await this.executeRequest(`/measurements/${metricId}${params}`);
  }

  static async upsertMeasurement(
    command: IUpsertMeasurementCommand,
    urlSegment: string
  ): Promise<ICommandResult> {
    return await this.executeRequest(
      `/measurements/${urlSegment}`,
      "POST",
      command
    );
  }

  static async deleteMeasurement(measurementId: string): Promise<void> {
    return await this.executeRequest(
      `/measurements/${measurementId}`,
      "DELETE",
      null
    );
  }

  static async searchMetricAttributes(
    metricId: string,
    searchText: string
  ): Promise<IAttributeSearchResult[]> {
    return await this.executeRequest(
      `/search/metric_attributes/${metricId}?searchText=${searchText}`,
      "GET",
      null
    );
  }

  static async getSystemInfo(): Promise<ISystemInfo> {
    return await this.executeRequest(`/system_info`, "GET", null);
  }

  static async executeRequest<T = void>(
    url: string,
    method: HttpMethod = "GET",
    payload: unknown = undefined
  ): Promise<T> {
    try {
      ServerApi.updateCounter("oneMore");

      const start = performance.now();

      const response = await this.getResponse(url, method, payload);

      this.printPerfData(method, url, response, start);

      const text = await response.text();
      const json = text ? JSON.parse(text) : null;

      if (response.ok) {
        return json;
      }

      throw new ApiError(response.status, json as IApiError);
    } finally {
      ServerApi.updateCounter("oneLess");
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

    if (this._jwtToken) {
      headers["Authorization"] = "Bearer " + this._jwtToken;
    }

    const requestConfig: RequestInit = {
      method: method,
      body: payload ? JSON.stringify(payload) : null,
      headers: headers,
    };

    return await fetch(
      new Request(envSettings.apiBaseUrl + url),
      requestConfig
    );
  }

  private static updateCounter(direction: "oneMore" | "oneLess") {
    const diff = direction == "oneMore" ? 1 : -1;
    ServerApi._loadingCounter = ServerApi._loadingCounter + diff;
    this.callOnLoadingToggle();
  }

  private static callOnLoadingToggle() {
    clearTimeout(ServerApi._timer as never);

    const isOver = ServerApi._loadingCounter === 0;

    if (!isOver) {
      ServerApi.onLoadingToggle?.(true);
      return;
    }

    ServerApi._timer = setTimeout(() => {
      ServerApi.onLoadingToggle?.(false);
    }, 700);
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
      `-- ${method} ${url} [${status}]: Server ${server} + Network ${network} = Total ${total} `
    );
  }
}
