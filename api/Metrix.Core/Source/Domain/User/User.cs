namespace Metrix.Core.Domain.User;

public class User : IUser
{
  public string? Id { get; set; }
  
  public string? Name { get; set; }
  
  public string? ImageUrl { get; set; }
}
