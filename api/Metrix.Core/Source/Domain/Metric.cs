namespace Metrix.Core.Domain;

public enum MetricType
{
  Counter,
  Gauge,
  Timed
}

public enum MetricUnit
{
}

public class Metric
{
  public string Name { get; set; }

  public string Description { get; set; }

  public MetricType Type { get; set; }

  public MetricUnit Unit { get; set; }
}


public class Measurement
{
  public Metric Metric { get; set; }

  public long Value { get; set; }

  public DateTime DateTime { get; set; }

  public string Notes { get; set; }
}