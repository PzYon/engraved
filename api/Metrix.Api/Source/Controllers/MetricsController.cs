using Metrix.Core.Application;
using Metrix.Core.Application.Commands;
using Metrix.Core.Application.Commands.Metrics.Add;
using Metrix.Core.Application.Commands.Metrics.Edit;
using Metrix.Core.Application.Queries.Metrics.Get;
using Metrix.Core.Application.Queries.Metrics.GetAll;
using Metrix.Core.Domain.Metrics;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Metrix.Api.Controllers;

[ApiController]
[Route("api/metrics")]
[Authorize]
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
  public async Task<CommandResult> Add([FromBody] AddMetricCommand command)
  {
    return await _dispatcher.Command(command);
  }

  [HttpPut]
  public async Task<CommandResult> Edit([FromBody] EditMetricCommand command)
  {
    return await _dispatcher.Command(command);
  }
}
