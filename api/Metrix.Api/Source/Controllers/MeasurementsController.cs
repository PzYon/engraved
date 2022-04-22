using Metrix.Core.Application;
using Metrix.Core.Application.Commands.Measurements.Add;
using Metrix.Core.Application.Commands.Measurements.Add.Counter;
using Metrix.Core.Application.Commands.Measurements.Add.Gauge;
using Metrix.Core.Application.Commands.Measurements.Add.Timer.End;
using Metrix.Core.Application.Commands.Measurements.Add.Timer.Start;
using Metrix.Core.Application.Queries.Measurements.GetAll;
using Metrix.Core.Domain.Measurements;
using Microsoft.AspNetCore.Mvc;

namespace Metrix.Api.Controllers;

[ApiController]
[Route("api/measurements")]
public class MeasurementsController : ControllerBase
{
  private readonly Dispatcher _dispatcher;

  public MeasurementsController(Dispatcher dispatcher)
  {
    _dispatcher = dispatcher;
  }

  [HttpGet]
  [Route("{metricKey}")]
  public async Task<object[]> GetAll(string metricKey)
  {
    IMeasurement[] measurements = await _dispatcher.Query(new GetAllMeasurementsQuery { MetricKey = metricKey });
    return measurements.EnsurePolymorphismWhenSerializing();
  }

  [HttpPost]
  [Route("counter")]
  public async Task AddCounter([FromBody] AddCounterMeasurementCommand measurement)
  {
    await _dispatcher.Command(measurement);
  }

  [HttpPost]
  [Route("gauge")]
  public async Task AddGauge([FromBody] AddGaugeMeasurementCommand measurement)
  {
    await _dispatcher.Command(measurement);
  }

  [HttpPost]
  [Route("timer_start")]
  public async Task StartTimer([FromBody] StartTimerMeasurementCommand measurement)
  {
    await _dispatcher.Command(measurement);
  }

  [HttpPost]
  [Route("timer_end")]
  public async Task EndTimer([FromBody] EndTimerMeasurementCommand measurement)
  {
    await _dispatcher.Command(measurement);
  }
}
