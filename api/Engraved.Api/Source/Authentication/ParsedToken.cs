namespace Engraved.Api.Authentication;

public class ParsedToken
{
  public string UserName { get; init; } = null!;

  public string? UserDisplayName { get; set; }

  public string? ImageUrl { get; init; }
}
