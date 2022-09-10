using Metrix.Core.Domain.Measurements;

namespace Metrix.Core.Application.Queries.Measurements.GetAll;

public class GetAllMeasurementsQuery : IQuery<IMeasurement[]>
{
  public string? MetricId { get; set; }

  public DateTime? FromDate { get; set; }
  
  public DateTime? ToDate { get; set; }

  public IDictionary<string, string[]> Attributes { get; set; } = new Dictionary<string, string[]>();

  IQueryExecutor<IMeasurement[]> IQuery<IMeasurement[]>.CreateExecutor()
  {
    return new GetAllMeasurementsQueryExecutor(this);
  }
}
