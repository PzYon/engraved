import { IMeasurement } from "./IMeasurement";
import { IMetric } from "./IMetric";

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

  async getMeasurements(metricKey: string): Promise<IMeasurement[]> {
    const response = await fetch(
      new Request(`${this.apiBaseUrl}/measurements?metricKey=${metricKey}`)
    );

    const data: Promise<IMeasurement[]> = await response.json();
    return data;
  }

  async addMeasurement(metricKey: string): Promise<void> {
    await fetch(new Request(`${this.apiBaseUrl}/measurements`), {
      method: "POST",
      body: JSON.stringify({ metricKey: metricKey }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
