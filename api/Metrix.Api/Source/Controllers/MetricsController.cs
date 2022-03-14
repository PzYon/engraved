using Metrix.Core.Application;
using Metrix.Core.Application.Commands.Metrics.Add;
using Metrix.Core.Application.Commands.Metrics.Edit;
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
    return _dispatcher.Query(new GetAllMetricsQuery());
  }

  [Route("{metricKey}")]
  [HttpGet]
  public Metric Get(string metricKey)
  {
    return _dispatcher.Query(new GetMetricQuery { MetricKey = metricKey });
  }

  [HttpPost]
  public void Add([FromBody] AddMetricCommand command)
  {
    _dispatcher.Command(command);
  }

  [HttpPut]
  public void Edit([FromBody] EditMetricCommand command)
  {
    _dispatcher.Command(command);
  }
}
