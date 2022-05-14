using Metrix.Api.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Metrix.Api.Controllers;

[ApiController]
[Route("api/auth")]
[AllowAnonymous]
public class AuthController : Controller
{
  private readonly TokenTranslator _tokenTranslator;

  public AuthController(TokenTranslator tokenTranslator)
  {
    _tokenTranslator = tokenTranslator;
  }

  [HttpPost("google")]
  [ProducesDefaultResponseType]
  public async Task<AuthResult> GoogleLogin(string token)
  {
    string jwt = await _tokenTranslator.GoogleTokenToJwtToken(token);

    return new AuthResult { JwtToken = jwt };
  }
}
