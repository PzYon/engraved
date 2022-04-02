import { IMeasurement } from "./IMeasurement";
import { IMetric } from "./IMetric";
import { MetricType } from "./MetricType";
import { IMetricFlags } from "./IMetricFlags";
import { IAddMetricCommand } from "./commands/IAddMetricCommand";
import { IAddMeasurementCommand } from "./commands/IAddMeasurementCommand";
import { IEditMetricCommand } from "./commands/IEditMetricCommand";
import { envSettings } from "../env/envSettings";
import { IApiError } from "./IApiError";

export class ServerApi {
  static async getMetrics(): Promise<IMetric[]> {
    return await this.executeRequest(`/metrics/`);
  }

  static async getMetric(metricKey: string): Promise<IMetric> {
    return await this.executeRequest(`/metrics/${metricKey}`);
  }

  static async addMetric(
    key: string,
    name: string,
    description: string,
    type: MetricType
  ): Promise<void> {
    const payload: IAddMetricCommand = {
      key: key,
      name: name,
      description: description,
      type: type,
    };

    await this.executeRequest("/metrics", "POST", payload);
  }

  static async editMetric(
    metricKey: string,
    name: string,
    description: string,
    metricFlags: IMetricFlags
  ): Promise<void> {
    const payload: IEditMetricCommand = {
      metricKey: metricKey,
      name: name,
      description: description,
      flags: metricFlags,
    };

    await this.executeRequest("/metrics/", "PUT", payload);
  }

  static async getMeasurements(metricKey: string): Promise<IMeasurement[]> {
    return await this.executeRequest(`/measurements?metricKey=${metricKey}`);
  }

  static async addMeasurement(
    metricKey: string,
    notes?: string,
    metricFlagKey?: string
  ): Promise<void> {
    const payload: IAddMeasurementCommand = {
      metricKey: metricKey,
      metricFlagKey: metricFlagKey,
      notes: notes,
    };

    await this.executeRequest("/measurements", "POST", payload);
  }

  static async executeRequest<T = void>(
    url: string,
    method: "GET" | "PUT" | "POST" = "GET",
    payload: unknown = undefined
  ): Promise<T> {
    const response: Response = await fetch(
      new Request(envSettings.apiBaseUrl + url),
      {
        method: method,
        body: payload ? JSON.stringify(payload) : null,
        headers: {
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
    throw new Error(apiError.message);
  }
}
