using Engraved.Core.Domain.Users;

namespace Engraved.Api.Authentication;

public class AuthResult
{
  public string? JwtToken { get; set; }

  public DateTime ExpiresAt { get; set; }

  public IUser? User { get; set; }
}
