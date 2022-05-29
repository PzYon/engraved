export interface IMeasurement {
  value: number;
  notes?: string;
  dateTime: string;
  metricAttributeValues?: { [key: string]: string[] };
}
