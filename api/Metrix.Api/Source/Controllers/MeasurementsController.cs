using Metrix.Core.Domain;
using Microsoft.AspNetCore.Mvc;

namespace Metrix.Api.Controllers;

[ApiController]
[Route("api/measurements")]
public class MeasurementsController : ControllerBase
{
  private readonly IMeasurementsLoader _measurementsLoader;

  public MeasurementsController(IMeasurementsLoader measurementsLoader)
  {
    _measurementsLoader = measurementsLoader;
  }

  [HttpGet]
  public Measurement[] GetMeasurements([FromQuery] string metricKey)
  {
    return _measurementsLoader.GetMeasurements(metricKey);
  }
}