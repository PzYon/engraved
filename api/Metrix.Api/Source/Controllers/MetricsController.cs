using Metrix.Core.Domain;
using Metrix.Core.Domain.Metrics;
using Microsoft.AspNetCore.Mvc;

namespace Metrix.Api.Controllers;

[ApiController]
[Route("api/metrics")]
public class MetricsController : ControllerBase
{
  private readonly IMetricsStore _metricsStore;

  public MetricsController(IMetricsStore metricsStore)
  {
    _metricsStore = metricsStore;
  }

  [HttpGet]
  public Metric[] GetMetrics()
  {
    return _metricsStore.GetMetrics();
  }

  [Route("{metricKey}")]
  [HttpGet]
  public Metric GetMetric(string metricKey)
  {
    return _metricsStore.GetMetric(metricKey);
  }
}