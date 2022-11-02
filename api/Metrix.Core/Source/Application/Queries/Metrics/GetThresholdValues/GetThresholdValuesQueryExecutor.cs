using Metrix.Core.Application.Persistence;
using Metrix.Core.Application.Queries.Metrics.Get;
using Metrix.Core.Domain.Measurements;
using Metrix.Core.Domain.Metrics;

namespace Metrix.Core.Application.Queries.Metrics.GetThresholdValues;

// todo:
// - consider a specific time period for threshold (must be configured and
//   used in calculations)
// - consider introducing IMetric.GetValue() so there's no need to cast in CalculateThresholds
// - what should be returned in results? only value/total? or also threshold limit, etc.?

public class GetThresholdValuesQueryExecutor : IQueryExecutor<IDictionary<string, IDictionary<string, double>>>
{
  public bool DisableCache => false;

  private readonly GetThresholdValuesQuery _query;

  public GetThresholdValuesQueryExecutor(GetThresholdValuesQuery query)
  {
    _query = query;
  }

  public async Task<IDictionary<string, IDictionary<string, double>>> Execute(IRepository repository)
  {
    var metricQuery = new GetMetricQueryExecutor(new GetMetricQuery { MetricId = _query.MetricId });
    IMetric? metric = await metricQuery.Execute(repository);

    if (metric == null)
    {
      return new Dictionary<string, IDictionary<string, double>>();
    }

    IMeasurement[] measurements = await repository.GetAllMeasurements(
      _query.MetricId!,
      _query.FromDate,
      _query.ToDate,
      null
    );

    return CalculateThresholds(metric, measurements);
  }

  private static IDictionary<string, IDictionary<string, double>> CalculateThresholds(
    IMetric metric,
    IMeasurement[] measurements
  )
  {
    Dictionary<string, IDictionary<string, double>> results = new();

    foreach ((string? attributeKey, Dictionary<string, double>? thresholds) in metric.Thresholds)
    {
      Dictionary<string, double> attributeResults = new();

      foreach ((string? attributeValueKey, double _) in thresholds)
      {
        double total = measurements.Where(
            m => m.MetricAttributeValues.TryGetValue(attributeKey, out string[]? valueKeys)
                 && valueKeys.Contains(attributeValueKey)
          )
          .OfType<GaugeMeasurement>()
          .Sum(m => m.Value);

        attributeResults.Add(attributeValueKey, total);
      }

      if (attributeResults.Count > 0)
      {
        results.Add(attributeKey, attributeResults);
      }
    }

    return results;
  }
}
