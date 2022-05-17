using Metrix.Core.Domain.User;

namespace Metrix.Api.Authentication;

public class AuthResult
{
  public string? JwtToken { get; set; }
  
  public IUser? User { get; set; }
}
