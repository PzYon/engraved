import { IMeasurement } from "./IMeasurement";
import { IMetric } from "./IMetric";
import { MetricType } from "./MetricType";
import { IMetricFlags } from "./IMetricFlags";
import { IAddMetricCommand } from "./commands/IAddMetricCommand";
import { IAddMeasurementCommand } from "./commands/IAddMeasurementCommand";
import { IEditMetricCommand } from "./commands/IEditMetricCommand";
import { envSettings } from "../env/envSettings";
import { IApiError } from "./IApiError";
import { ICommandResult } from "./ICommandResult";

export class ServerApi {
  private static _token: string;

  static setToken(token: string): void {
    this._token = token;
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
    metricFlags: IMetricFlags
  ): Promise<ICommandResult> {
    const payload: IEditMetricCommand = {
      metricId: metricId,
      name: name,
      description: description,
      flags: metricFlags,
    };

    return await this.executeRequest("/metrics/", "PUT", payload);
  }

  static async getMeasurements(metricId: string): Promise<IMeasurement[]> {
    return await this.executeRequest(`/measurements/${metricId}`);
  }

  static async addMeasurement(
    command: IAddMeasurementCommand,
    urlSegment: string
  ): Promise<ICommandResult> {
    return await this.executeRequest(
      "/measurements/" + urlSegment,
      "POST",
      command
    );
  }

  static async executeRequest<T = void>(
    url: string,
    method: "GET" | "PUT" | "POST" = "GET",
    payload: unknown = undefined
  ): Promise<T> {
    if (!this._token) {
      throw new Error("You are not authenticated.");
    }

    const response: Response = await fetch(
      new Request(envSettings.apiBaseUrl + url),
      {
        method: method,
        body: payload ? JSON.stringify(payload) : null,
        headers: {
          Authorization: "Bearer " + this._token,
          "Content-Type": "application/json",
        },
      }
    );

    const text = await response.text();
    const json = text ? JSON.parse(text) : null;

    if (response.ok) {
      return json;
    }

    const apiError = json as IApiError;
    throw new Error(response.status + ": " + apiError?.message || " -");
  }
}
