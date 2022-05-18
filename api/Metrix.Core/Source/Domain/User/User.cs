namespace Metrix.Core.Domain.User;

public class User : IUser
{
  public string? Id { get; set; }

  public string Name { get; set; } = null!;

  public string? ImageUrl { get; set; }

  public DateTime? LastLoginDate { get; set; }
}
