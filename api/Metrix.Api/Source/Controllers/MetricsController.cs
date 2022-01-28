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
  public Metric[] GetMeasurements()
  {
    return _metricsLoader.GetMetrics();
  }
}