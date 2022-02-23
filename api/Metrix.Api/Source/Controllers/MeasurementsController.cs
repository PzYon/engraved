using Metrix.Core.Application.Commands.Measurements.Add;
using Metrix.Core.Application.Persistence;
using Metrix.Core.Application.Queries.Measurements;
using Metrix.Core.Application.Queries.Measurements.GetAll;
using Metrix.Core.Domain.Measurements;
using Microsoft.AspNetCore.Mvc;

namespace Metrix.Api.Controllers;

[ApiController]
[Route("api/measurements")]
public class MeasurementsController : ControllerBase
{
  private readonly IDb _db;

  public MeasurementsController(IDb db)
  {
    _db = db;
  }

  [HttpGet]
  public Measurement[] GetAll([FromQuery] string metricKey)
  {
    var query = new GetAllMeasurementsQuery { MetricKey = metricKey };
    return query.CreateExecutor().Execute(_db, query);
  }

  [HttpPost]
  public void Add([FromBody] AddMeasurementCommand measurement)
  {
    measurement.CreateExecutor().Execute(_db, measurement);
  }
}
