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

type HttpMethod = "GET" | "PUT" | "POST" | "DELETE";

export class ServerApi {
  private static _jwtToken: string;

  static async wakeMeUp() {
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
    attributes: IMetricAttributes
  ): Promise<ICommandResult> {
    const payload: IEditMetricCommand = {
      metricId: metricId,
      name: name,
      description: description,
      notes: notes,
      attributes: attributes,
    };

    return await this.executeRequest("/metrics/", "PUT", payload);
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

  static async getMeasurements(metricId: string): Promise<IMeasurement[]> {
    return await this.executeRequest(`/measurements/${metricId}`);
  }

  static async addMeasurement(
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

  static async getSystemInfo(): Promise<ISystemInfo> {
    return await this.executeRequest(`/system_info`, "GET", null);
  }

  static async executeRequest<T = void>(
    url: string,
    method: HttpMethod = "GET",
    payload: unknown = undefined
  ): Promise<T> {
    const start = performance.now();

    const response = await this.getResponse(url, method, payload);

    this.printPerfData(method, url, response, start);

    const text = await response.text();
    const json = text ? JSON.parse(text) : null;

    if (response.ok) {
      return json;
    }

    throw new ApiError(response.status, json as IApiError);
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
