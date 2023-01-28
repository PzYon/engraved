using Engraved.Core.Application;
using Engraved.Core.Application.Commands.Measurements.Delete;
using Engraved.Core.Application.Commands.Measurements.Upsert.Counter;
using Engraved.Core.Application.Commands.Measurements.Upsert.Gauge;
using Engraved.Core.Application.Commands.Measurements.Upsert.Timer;
using Engraved.Core.Application.Queries.Measurements.GetActive;
using Engraved.Core.Application.Queries.Measurements.GetAll;
using Engraved.Core.Domain.Measurements;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Engraved.Api.Controllers;

[ApiController]
[Route("api/measurements")]
[Authorize]
public class MeasurementsController : ControllerBase
{
  private readonly Dispatcher _dispatcher;

  public MeasurementsController(Dispatcher dispatcher)
  {
    _dispatcher = dispatcher;
  }

  [HttpGet]
  [Route("{metricId}")]
  public async Task<object[]> GetAll(string metricId, DateTime? fromDate, DateTime? toDate, string? attributeValues)
  {
    var query = new GetAllMeasurementsQuery
    {
      MetricId = metricId,
      FromDate = fromDate,
      ToDate = toDate,
      AttributeValues = AttributeValueParser.Parse(attributeValues)
    };

    IMeasurement[] measurements = await _dispatcher.Query(query);

    return measurements.EnsurePolymorphismWhenSerializing();
  }

  [HttpGet]
  [Route("{metricId}/active")]
  public async Task<IMeasurement?> GetActive(string metricId)
  {
    return await _dispatcher.Query(new GetActiveMeasurementQuery { MetricId = metricId });
  }

  [HttpPost]
  [Route("counter")]
  public async Task AddCounter([FromBody] UpsertCounterMeasurementCommand measurement)
  {
    await _dispatcher.Command(measurement);
  }

  [HttpPost]
  [Route("gauge")]
  public async Task AddGauge([FromBody] UpsertGaugeMeasurementCommand measurement)
  {
    await _dispatcher.Command(measurement);
  }

  [HttpPost]
  [Route("timer")]
  public async Task StartTimer([FromBody] UpsertTimerMeasurementCommand measurement)
  {
    await _dispatcher.Command(measurement);
  }

  [HttpDelete]
  [Route("{measurementId}")]
  public async Task Delete(string measurementId)
  {
    await _dispatcher.Command(new DeleteMeasurementCommand { Id = measurementId });
  }
}
