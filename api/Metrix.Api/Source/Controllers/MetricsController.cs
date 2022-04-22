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
  public async Task<object[]> GetAll()
  {
    IMetric[] metrics = await _dispatcher.Query(new GetAllMetricsQuery());
    return metrics.EnsurePolymorphismWhenSerializing();
  }

  [Route("{metricKey}")]
  [HttpGet]
  public async Task<IMetric> Get(string metricKey)
  {
    return await _dispatcher.Query(new GetMetricQuery { MetricKey = metricKey });
  }

  [HttpPost]
  public async Task Add([FromBody] AddMetricCommand command)
  {
    await _dispatcher.Command(command);
  }

  [HttpPut]
  public async Task Edit([FromBody] EditMetricCommand command)
  {
    await _dispatcher.Command(command);
  }
}
