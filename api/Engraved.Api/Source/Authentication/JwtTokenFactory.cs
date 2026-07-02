using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Engraved.Api.Settings;
using Engraved.Core.Application;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace Engraved.Api.Authentication;

public class JwtTokenFactory(AuthenticationConfig configuration, IDateService dateService)
{
  public JwtTokenFactory(IOptions<AuthenticationConfig> configuration, IDateService dateService)
    : this(configuration.Value, dateService) { }

  public DateTime GetAccessTokenExpiry()
  {
    return dateService.UtcNow.AddMinutes(configuration.AccessTokenLifetimeMinutes);
  }

  public string CreateAccessToken(string userName, DateTime expiresAt)
  {
    var tokenDescriptor = new SecurityTokenDescriptor
    {
      Subject = new ClaimsIdentity([new Claim(ClaimTypes.NameIdentifier, userName)]),
      IssuedAt = dateService.UtcNow,
      Expires = expiresAt,
      Issuer = configuration.TokenIssuer,
      Audience = configuration.TokenAudience,
      SigningCredentials = GetSigningCredentials()
    };

    var tokenHandler = new JwtSecurityTokenHandler();
    SecurityToken? securityToken = tokenHandler.CreateToken(tokenDescriptor);
    return tokenHandler.WriteToken(securityToken);
  }

  private SigningCredentials GetSigningCredentials()
  {
    if (string.IsNullOrEmpty(configuration.JwtSecret))
    {
      throw new InvalidOperationException($"\"{nameof(AuthenticationConfig.JwtSecret)}\" must be set on the config.");
    }

    return new SigningCredentials(
      new SymmetricSecurityKey(Encoding.ASCII.GetBytes(configuration.JwtSecret)),
      SecurityAlgorithms.HmacSha256Signature
    );
  }
}
