import { IMeasurement } from "./IMeasurement";
import { IMetric } from "./IMetric";
import { MetricType } from "./MetricType";
import { IMetricFlags } from "./IMetricFlags";
import { IAddMetricCommand } from "./commands/IAddMetricCommand";
import { IAddMeasurementCommand } from "./commands/IAddMeasurementCommand";
import { IEditMetricCommand } from "./commands/IEditMetricCommand";
import { envSettings } from "../env/envSettings";

export class ServerApi {
  static async getMetrics(): Promise<IMetric[]> {
    const response = await this.executeRequest(`/metrics/`);
    return await response.json();
  }

  static async getMetric(metricKey: string): Promise<IMetric> {
    const response = await this.executeRequest(`/metrics/${metricKey}`);
    return await response.json();
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
    metricFlags: IMetricFlags
  ): Promise<void> {
    const payload: IEditMetricCommand = {
      metricKey: metricKey,
      flags: metricFlags,
    };
    await this.executeRequest("/metrics/", "PUT", payload);
  }

  static async getMeasurements(metricKey: string): Promise<IMeasurement[]> {
    const response = await this.executeRequest(
      `/measurements?metricKey=${metricKey}`
    );
    return await response.json();
  }

  static async addMeasurement(
    metricKey: string,
    metricFlagKey?: string
  ): Promise<void> {
    const payload: IAddMeasurementCommand = {
      metricKey: metricKey,
      metricFlagKey: metricFlagKey,
    };

    await this.executeRequest("/measurements", "POST", payload);
  }

  static async executeRequest(
    url: string,
    method: "GET" | "PUT" | "POST" = "GET",
    payload: unknown = undefined
  ): Promise<Response> {
    return await fetch(new Request(envSettings.apiBaseUrl + url), {
      method: method,
      body: payload ? JSON.stringify(payload) : null,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
