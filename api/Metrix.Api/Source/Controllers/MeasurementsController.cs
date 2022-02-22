using Metrix.Core.Application.Commands.Measurements.Add;
using Metrix.Core.Domain.Measurements;
using Microsoft.AspNetCore.Mvc;

namespace Metrix.Api.Controllers;

[ApiController]
[Route("api/measurements")]
public class MeasurementsController : ControllerBase
{
  private readonly IMeasurementsStore _measurementsStore;

  public MeasurementsController(IMeasurementsStore measurementsStore)
  {
    _measurementsStore = measurementsStore;
  }

  [HttpGet]
  public Measurement[] GetAll([FromQuery] string metricKey)
  {
    return _measurementsStore.GetAll(metricKey);
  }

  [HttpPost]
  public void Add([FromBody] AddMeasurementCommand measurement)
  {
    _measurementsStore.Add(measurement);
  }
}
