using Metrix.Core.Application;
using Metrix.Core.Application.Commands.Measurements.Add;
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
  public IMeasurement[] GetAll([FromQuery] string metricKey)
  {
    return _dispatcher.Query(new GetAllMeasurementsQuery { MetricKey = metricKey });
  }

  [HttpPost]
  [Route("counter")]
  public void AddCounter([FromBody] AddCounterMeasurementCommand measurement)
  {
    _dispatcher.Command(measurement);
  }

  [HttpPost]
  [Route("gauge")]
  public void AddGauge([FromBody] AddGaugeMeasurementCommand measurement)
  {
    _dispatcher.Command(measurement);
  }

  [HttpPost]
  [Route("timer_start")]
  public void StartTimer([FromBody] StartTimerMeasurementCommand measurement)
  {
    _dispatcher.Command(measurement);
  }

  [HttpPost]
  [Route("timer_end")]
  public void EndTimer([FromBody] EndTimerMeasurementCommand measurement)
  {
    _dispatcher.Command(measurement);
  }
}
