using Engraved.Core.Application.Queries.Search.Entities;

namespace Engraved.Core.Application.Queries.Search.Related;

public class GetRelatedEntitiesQuery : IQuery
{
  public EntityType EntityType { get; set; }

  public string? EntityId { get; set; }

  public int? Limit { get; set; }
}
