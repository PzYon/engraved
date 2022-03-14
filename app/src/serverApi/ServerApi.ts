import { IMeasurement } from "./IMeasurement";
import { IMetric } from "./IMetric";
import { MetricType } from "./MetricType";
import { IMetricFlags } from "./IMetricFlags";

export class ServerApi {
  constructor(private apiBaseUrl: string) {}

  async getMetrics(): Promise<IMetric[]> {
    const response = await fetch(new Request(`${this.apiBaseUrl}/metrics`));

    const data: Promise<IMetric[]> = await response.json();
    return data;
  }

  async getMetric(metricKey: string): Promise<IMetric> {
    const response = await fetch(
      new Request(`${this.apiBaseUrl}/metrics/${metricKey}`)
    );

    const data: Promise<IMetric> = await response.json();
    return data;
  }

  async addMetric(
    key: string,
    name: string,
    description: string,
    type: MetricType
  ): Promise<void> {
    await fetch(new Request(`${this.apiBaseUrl}/metrics`), {
      method: "POST",
      body: JSON.stringify({
        key: key,
        name: name,
        description: description,
        type: type,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async editMetric(
    metricKey: string,
    metricFlags: IMetricFlags
  ): Promise<void> {
    await fetch(new Request(`${this.apiBaseUrl}/metrics/`), {
      method: "PUT",
      body: JSON.stringify({ metricKey: metricKey, flags: metricFlags }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async getMeasurements(metricKey: string): Promise<IMeasurement[]> {
    const response = await fetch(
      new Request(`${this.apiBaseUrl}/measurements?metricKey=${metricKey}`)
    );

    const data: Promise<IMeasurement[]> = await response.json();
    return data;
  }

  async addMeasurement(
    metricKey: string,
    metricFlagKey?: string
  ): Promise<void> {
    await fetch(new Request(`${this.apiBaseUrl}/measurements`), {
      method: "POST",
      body: JSON.stringify({
        metricKey: metricKey,
        metricFlagKey: metricFlagKey,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
