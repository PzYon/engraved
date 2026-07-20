using Engraved.Api.Settings;
using Microsoft.Extensions.Options;

namespace Engraved.Api.Authentication;

// Whether a user is an admin is derived live from configuration (AdminConfig.Emails), never
// persisted, so changing the allowlist takes effect immediately without touching user data.
public class AdminAuthorizationService(IOptions<AdminConfig> adminConfig)
{
  public bool IsAdmin(string? userName)
  {
    if (string.IsNullOrEmpty(userName))
    {
      return false;
    }

    return GetAdminEmails().Contains(userName, StringComparer.OrdinalIgnoreCase);
  }

  private IEnumerable<string> GetAdminEmails()
  {
    return (adminConfig.Value.Emails ?? string.Empty)
      .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
  }
}
