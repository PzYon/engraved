using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Metrix.Api.Authentication.Google;
using Metrix.Api.Settings;
using Metrix.Core.Application;
using Metrix.Core.Application.Persistence;
using Metrix.Core.Domain.User;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace Metrix.Api.Authentication;

public class LoginHandler : ILoginHandler
{
  private readonly AuthenticationConfig _authenticationConfig;
  private readonly IDateService _dateService;
  private readonly IRepository _repository;
  private readonly IGoogleTokenValidator _tokenValidator;

  public LoginHandler(
    IGoogleTokenValidator tokenValidator,
    IRepository repository,
    IOptions<AuthenticationConfig> configuration,
    IDateService dateService
    ) : this(tokenValidator, repository, configuration.Value, dateService) { }

  public LoginHandler(
    IGoogleTokenValidator tokenValidator,
    IRepository repository,
    AuthenticationConfig configuration,
    IDateService dateService
    )
  {
    _tokenValidator = tokenValidator;
    _repository = repository;
    _authenticationConfig = configuration;
    _dateService = dateService;
  }

  public async Task<AuthResult> Login(string? token)
  {
    if (string.IsNullOrEmpty(token))
    {
      throw new ArgumentException("Token is null or empty, cannot login.");
    }

    ParsedToken parsedToken = await _tokenValidator.ParseAndValidate(token);

    string userName = parsedToken.UserName;

    IUser user = await _repository.GetUser(userName)
                 ?? new User { Name = userName };

    user.DisplayName = parsedToken.UserDisplayName;
    user.ImageUrl = parsedToken.ImageUrl;
    user.LastLoginDate = _dateService.UtcNow;

    UpsertResult result = await _repository.UpsertUser(user);
    user.Id = result.EntityId;

    return new AuthResult
    {
      JwtToken = ToJwtToken(userName),
      User = user
    };
  }

  private string ToJwtToken(string userId)
  {
    var tokenDescriptor = new SecurityTokenDescriptor
    {
      Subject = new ClaimsIdentity(GetClaims(userId)),
      Expires = _dateService.UtcNow.AddHours(6),
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
