using Metrix.Core.Application;
using Metrix.Core.Application.Commands;
using Metrix.Core.Application.Commands.Metrics.Add;
using Metrix.Core.Application.Commands.Metrics.Delete;
using Metrix.Core.Application.Commands.Metrics.Edit;
using Metrix.Core.Application.Commands.Metrics.EditPermissions;
using Metrix.Core.Application.Queries.Metrics.Get;
using Metrix.Core.Application.Queries.Metrics.GetAll;
using Metrix.Core.Application.Queries.Metrics.GetThresholdValues;
using Metrix.Core.Domain.Metrics;
using Metrix.Core.Domain.Permissions;
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

  [Route("{metricId}")]
  [HttpGet]
  public async Task<IMetric?> Get(string metricId)
  {
    var command = new GetMetricQuery { MetricId = metricId };

    return await _dispatcher.Query(command);
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

  [Route("{metricId}/permissions")]
  [HttpPut]
  public async Task<CommandResult> Permissions(
    [FromBody] Dictionary<string, PermissionKind> permissions,
    string metricId
  )
  {
    var command = new EditMetricPermissionsCommand
    {
      MetricId = metricId,
      Permissions = permissions
    };

    return await _dispatcher.Command(command);
  }

  [Route("{metricId}/threshold_values")]
  [HttpGet]
  public async Task<IDictionary<string, IDictionary<string, ThresholdResult>>> GetThresholdValues(
    string metricId,
    DateTime? fromDate,
    DateTime? toDate
  )
  {
    var query = new GetThresholdValuesQuery
    {
      MetricId = metricId,
      FromDate = fromDate,
      ToDate = toDate
    };

    return await _dispatcher.Query(query);
  }

  [HttpDelete]
  [Route("{metricId}")]
  public async Task Delete(string metricId)
  {
    await _dispatcher.Command(new DeleteMetricCommand { Id = metricId });
  }
}
