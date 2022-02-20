using Metrix.Core.Domain;
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
  public Measurement[] GetMeasurements([FromQuery] string metricKey)
  {
    return _measurementsStore.GetMeasurements(metricKey);
  }
}