using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text.Encodings.Web;
using Engraved.Core.Application;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Primitives;

namespace Engraved.Api.Authentication.Basic;

public class BasicAuthenticationHandler : AuthenticationHandler<AuthenticationSchemeOptions>
{
  private readonly ICurrentUserService _currentUserService;

  public BasicAuthenticationHandler(
    IOptionsMonitor<AuthenticationSchemeOptions> options,
    ILoggerFactory logger,
    UrlEncoder encoder,
    ISystemClock clock,
    ICurrentUserService currentUserService
  )
    : base(options, logger, encoder, clock)
  {
    _currentUserService = currentUserService;
  }

  protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
  {
    if (!Request.Headers.TryGetValue("Authorization", out StringValues value))
    {
      return AuthenticateResult.Fail("Missing Authorization Header");
    }

    AuthenticationHeaderValue authHeader = AuthenticationHeaderValue.Parse(value);
    if (string.IsNullOrEmpty(authHeader.Parameter))
    {
      throw new Exception("Username must be specified.");
    }

    _currentUserService.SetUserName(authHeader.Parameter);

    var claims = new[]
    {
      new Claim(ClaimTypes.NameIdentifier, authHeader.Parameter),
      new Claim(ClaimTypes.Name, authHeader.Parameter)
    };

    var identity = new ClaimsIdentity(claims, Scheme.Name);
    var principal = new ClaimsPrincipal(identity);
    var ticket = new AuthenticationTicket(principal, Scheme.Name);

    return AuthenticateResult.Success(ticket);
  }
}
