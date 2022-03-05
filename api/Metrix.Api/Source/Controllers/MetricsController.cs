using Metrix.Core.Application;
using Metrix.Core.Application.Commands.Metrics.Add;
using Metrix.Core.Application.Queries.Metrics.Get;
using Metrix.Core.Application.Queries.Metrics.GetAll;
using Metrix.Core.Domain.Metrics;
using Microsoft.AspNetCore.Mvc;

namespace Metrix.Api.Controllers;

[ApiController]
[Route("api/metrics")]
public class MetricsController : ControllerBase
{
  private readonly Dispatcher _dispatcher;

  public MetricsController(Dispatcher dispatcher)
  {
    _dispatcher = dispatcher;
  }

  [HttpGet]
  public Metric[] GetAll()
  {
    var query = new GetAllMetricsQuery();
    return _dispatcher.Query<GetAllMetricsQuery, Metric[]>(query);
  }

  [Route("{metricKey}")]
  [HttpGet]
  public Metric Get(string metricKey)
  {
    var query = new GetMetricQuery {MetricKey = metricKey};
    return _dispatcher.Query<GetMetricQuery, Metric>(query);
  }

  [HttpPost]
  public void Add([FromBody] AddMetricCommand measurement)
  {
    _dispatcher.Command(measurement);
  }
}
