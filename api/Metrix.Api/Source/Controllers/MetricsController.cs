using Metrix.Core.Application.Persistence;
using Metrix.Core.Application.Queries.Metrics.GetAll;
using Metrix.Core.Application.Queries.Metrics.GetOne;
using Metrix.Core.Domain.Metrics;
using Microsoft.AspNetCore.Mvc;

namespace Metrix.Api.Controllers;

[ApiController]
[Route("api/metrics")]
public class MetricsController : ControllerBase
{
  private readonly IDb _db;

  public MetricsController(IDb db)
  {
    _db = db;
  }

  [HttpGet]
  public Metric[] GetAll()
  {
    var query = new GetAllMetricsQuery();
    return query.CreateExecutor().Execute(_db, query);
  }

  [Route("{metricKey}")]
  [HttpGet]
  public Metric Get(string metricKey)
  {
    var query = new GetMetricQuery { MetricKey = metricKey };
    return query.CreateExecutor().Execute(_db, query);
  }
}
