using Metrix.Core.Domain;
using Microsoft.AspNetCore.Mvc;

namespace Metrix.Api.Controllers;

[ApiController]
[Route("api/metrics")]
public class MetricsController : ControllerBase
{
  private readonly IMetricsLoader _metricsLoader;

  public MetricsController(IMetricsLoader metricsLoader)
  {
    _metricsLoader = metricsLoader;
  }

  [HttpGet]
  public Metric[] GetMetrics()
  {
    return _metricsLoader.GetMetrics();
  }

  [Route("{metricKey}")]
  [HttpGet]
  public Metric GetMetric(string metricKey)
  {
    return _metricsLoader.GetMetric(metricKey);
  }
}