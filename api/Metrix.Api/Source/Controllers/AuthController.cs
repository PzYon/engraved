using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Google.Apis.Auth;
using Metrix.Api.Settings;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace Metrix.Api.Controllers;

public class AuthResult
{
  public string JwtToken { get; set; }
}

[ApiController]
[Route("api/auth")]
[AllowAnonymous]
public class AuthController : Controller
{
  private readonly AuthenticationConfig _configuration;

  public AuthController(IOptions<AuthenticationConfig> configuration)
  {
    _configuration = configuration.Value;
  }

  [HttpPost("google")]
  [ProducesDefaultResponseType]
  public async Task<AuthResult> GoogleLogin(string token)
  {
    var validationSettings = new GoogleJsonWebSignature.ValidationSettings
    {
      Audience = new[] { _configuration.GoogleClientId }
    };

    GoogleJsonWebSignature.Payload payload = await GoogleJsonWebSignature.ValidateAsync(token, validationSettings);

    return new AuthResult
    {
      JwtToken = GenerateJwtToken(payload.Email)
    };
  }

  private string GenerateJwtToken(string userId)
  {
    var mySecurityKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_configuration.JwtSecret));
    var tokenDescriptor = new SecurityTokenDescriptor
    {
      Subject = new ClaimsIdentity(new[] { new Claim(ClaimTypes.NameIdentifier, userId) }),
      Expires = DateTime.UtcNow.AddDays(7),
      Issuer = "http://mysite.com",
      Audience = "http://myaudience.com",
      SigningCredentials = new SigningCredentials(mySecurityKey, SecurityAlgorithms.HmacSha256Signature)
    };

    var tokenHandler = new JwtSecurityTokenHandler();
    return tokenHandler.WriteToken(tokenHandler.CreateToken(tokenDescriptor));
  }
}
