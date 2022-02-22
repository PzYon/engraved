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
  public Metric[] GetAll()
  {
    return _metricsStore.GetAll();
  }

  [Route("{metricKey}")]
  [HttpGet]
  public Metric Get(string metricKey)
  {
    return _metricsStore.Get(metricKey);
  }
}