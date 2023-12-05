namespace Engraved.Core.Application.Queries;

public interface IEntitiesQuery : IQuery
{
  public int? Limit { get; set; }

  public string? SearchText { get; set; }
}
