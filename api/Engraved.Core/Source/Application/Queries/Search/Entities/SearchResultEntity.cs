using Engraved.Core.Domain;

namespace Engraved.Core.Application.Queries.Search.Entities;

public class SearchResultEntity
{
  public IEntity Entity { get; set; } = null!;

  public EntityType EntityType { get; set; }
}
