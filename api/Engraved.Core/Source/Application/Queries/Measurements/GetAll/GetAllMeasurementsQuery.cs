using Engraved.Core.Domain.Measurements;

namespace Engraved.Core.Application.Queries.Measurements.GetAll;

public class GetAllMeasurementsQuery : IQuery<IMeasurement[]>
{
  public string? JournalId { get; set; }

  public DateTime? FromDate { get; set; }

  public DateTime? ToDate { get; set; }

  public IDictionary<string, string[]> AttributeValues { get; set; } = new Dictionary<string, string[]>();

  IQueryExecutor<IMeasurement[]> IQuery<IMeasurement[]>.CreateExecutor()
  {
    return new GetAllMeasurementsQueryExecutor(this);
  }
}
