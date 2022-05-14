using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Google.Apis.Auth;
using Metrix.Api.Settings;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace Metrix.Api.Authentication;

public class TokenTranslator
{
  private readonly AuthenticationConfig _authenticationConfig;

  public TokenTranslator(IOptions<AuthenticationConfig> configuration)
  {
    _authenticationConfig = configuration.Value;
  }

  public async Task<string> GoogleTokenToJwtToken(string token)
  {
    var validationSettings = new GoogleJsonWebSignature.ValidationSettings
    {
      Audience = new[] { _authenticationConfig.GoogleClientId }
    };

    GoogleJsonWebSignature.Payload payload = await GoogleJsonWebSignature.ValidateAsync(token, validationSettings);

    return GenerateJwtToken(payload.Email);
  }

  private string GenerateJwtToken(string userId)
  {
    var tokenDescriptor = new SecurityTokenDescriptor
    {
      Subject = new ClaimsIdentity(GetClaims(userId)),
      Expires = DateTime.UtcNow.AddDays(7),
      Issuer = _authenticationConfig.TokenIssuer,
      Audience = _authenticationConfig.TokenAudience,
      SigningCredentials = GetSigningCredentials()
    };

    var tokenHandler = new JwtSecurityTokenHandler();
    SecurityToken securityToken = tokenHandler.CreateToken(tokenDescriptor);
    return tokenHandler.WriteToken(securityToken);
  }

  private SigningCredentials GetSigningCredentials()
  {
    if (string.IsNullOrEmpty(_authenticationConfig.JwtSecret))
    {
      throw new Exception($"\"{nameof(AuthenticationConfig.JwtSecret)}\" must be set on the config.");
    }

    return new SigningCredentials(
      new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_authenticationConfig.JwtSecret)),
      SecurityAlgorithms.HmacSha256Signature
    );
  }

  private static Claim[] GetClaims(string userId)
  {
    return new[] { new Claim(ClaimTypes.NameIdentifier, userId) };
  }
}
