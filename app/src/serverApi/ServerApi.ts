import { IMeasurement } from "./IMeasurement";
import { IMetric } from "./IMetric";
import { MetricType } from "./MetricType";
import { IMetricFlags } from "./IMetricFlags";
import { IAddMetricCommand } from "./commands/IAddMetricCommand";
import { IAddMeasurementCommand } from "./commands/IAddMeasurementCommand";
import { IEditMetricCommand } from "./commands/IEditMetricCommand";

export class ServerApi {
  constructor(private apiBaseUrl: string) {}

  async getMetrics(): Promise<IMetric[]> {
    const response = await this.executeRequest(`/metrics/`);
    return await response.json();
  }

  async getMetric(metricKey: string): Promise<IMetric> {
    const response = await this.executeRequest(`/metrics/${metricKey}`);
    return await response.json();
  }

  async addMetric(
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

  async editMetric(
    metricKey: string,
    metricFlags: IMetricFlags
  ): Promise<void> {
    const payload: IEditMetricCommand = {
      metricKey: metricKey,
      flags: metricFlags,
    };
    await this.executeRequest("/metrics/", "PUT", payload);
  }

  async getMeasurements(metricKey: string): Promise<IMeasurement[]> {
    const response = await this.executeRequest(
      `/measurements?metricKey=${metricKey}`
    );
    return await response.json();
  }

  async addMeasurement(
    metricKey: string,
    metricFlagKey?: string
  ): Promise<void> {
    const payload: IAddMeasurementCommand = {
      metricKey: metricKey,
      metricFlagKey: metricFlagKey,
    };

    await this.executeRequest("/measurements", "POST", payload);
  }

  async executeRequest(
    url: string,
    method: "GET" | "PUT" | "POST" = "GET",
    payload: unknown = undefined
  ): Promise<Response> {
    return await fetch(new Request(this.apiBaseUrl + url), {
      method: method,
      body: payload ? JSON.stringify(payload) : null,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
