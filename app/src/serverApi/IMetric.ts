import { IMeasurement } from "./IMeasurement";

export interface IMetric {
  key: string;
  name: string;
  description: string;
  type: string;
  unit: string;
}

export class ServerApi {
  constructor(private apiBaseUrl: string) {}

  async getMetrics(): Promise<IMetric[]> {
    const response = await fetch(
      new Request(`${this.apiBaseUrl}/metrics?metricKey=foo_bar`)
    );

    const data: Promise<IMetric[]> = await response.json();
    return data;
  }

  async getMeasurements(metricKey: string): Promise<IMeasurement[]> {
    const response = await fetch(
      new Request(`${this.apiBaseUrl}/measurements?metricKey=${metricKey}`)
    );

    const data: Promise<IMeasurement[]> = await response.json();
    return data;
  }
}
