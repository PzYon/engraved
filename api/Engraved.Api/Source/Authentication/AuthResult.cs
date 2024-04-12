using Engraved.Core.Domain.Users;

namespace Engraved.Api.Authentication;

public class AuthResult
{
  public string? JwtToken { get; set; }

  public IUser? User { get; set; }
}
