using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Engraved.Api.Authentication.Google;
using Engraved.Api.Settings;
using Engraved.Core.Application;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.User;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace Engraved.Api.Authentication;

public class LoginHandler : ILoginHandler
{
  private readonly AuthenticationConfig _authenticationConfig;
  private readonly IDateService _dateService;
  private readonly IBaseRepository _repository;
  private readonly IGoogleTokenValidator _tokenValidator;

  public LoginHandler(
    IGoogleTokenValidator tokenValidator,
    IBaseRepository repository,
    IOptions<AuthenticationConfig> configuration,
    IDateService dateService
  ) : this(tokenValidator, repository, configuration.Value, dateService) { }

  public LoginHandler(
    IGoogleTokenValidator tokenValidator,
    IBaseRepository repository,
    AuthenticationConfig configuration,
    IDateService dateService
  )
  {
    _tokenValidator = tokenValidator;
    _repository = repository;
    _authenticationConfig = configuration;
    _dateService = dateService;
  }

  public async Task<AuthResult> Login(string? idToken)
  {
    if (string.IsNullOrEmpty(idToken))
    {
      throw new ArgumentException("Token is null or empty, cannot login.");
    }

    ParsedToken parsedToken = await _tokenValidator.ParseAndValidate(idToken);

    IUser user = await EnsureUser(parsedToken.UserName, parsedToken.UserDisplayName, parsedToken.ImageUrl);

    return new AuthResult
    {
      JwtToken = ToJwtToken(parsedToken.UserName),
      User = user
    };
  }

  private async Task<IUser> EnsureUser(string userName, string? displayName, string? imageUrl)
  {
    IUser user = await _repository.GetUser(userName)
                 ?? new User { Name = userName };

    user.DisplayName = displayName;
    user.ImageUrl = imageUrl;
    user.LastLoginDate = _dateService.UtcNow;

    if (user.FavoriteJournalIds.Count == 0)
    {
      await EnsureQuickScraps(user);
    }

    UpsertResult result = await _repository.UpsertUser(user);
    user.Id = result.EntityId;
    return user;
  }

  public async Task<AuthResult> LoginForTests(string? userName)
  {
    if (string.IsNullOrEmpty(userName))
    {
      throw new Exception($"{nameof(userName)} is null, maybe you are not running test mode?");
    }

    IUser user = await EnsureUser(userName, userName, null);

    return new AuthResult
    {
      User = user,
      JwtToken = userName
    };
  }

  private string ToJwtToken(string userId)
  {
    var tokenDescriptor = new SecurityTokenDescriptor
    {
      Subject = new ClaimsIdentity(GetClaims(userId)),
      IssuedAt = _dateService.UtcNow,
      Expires = _dateService.UtcNow.AddHours(18),
      Issuer = _authenticationConfig.TokenIssuer,
      Audience = _authenticationConfig.TokenAudience,
      SigningCredentials = GetSigningCredentials()
    };

    var tokenHandler = new JwtSecurityTokenHandler();
    SecurityToken? securityToken = tokenHandler.CreateToken(tokenDescriptor);
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

  private async Task EnsureQuickScraps(IUser user)
  {
    IJournal journal = new ScrapsJournal
    {
      Name = "Quick Scraps",
      EditedOn = _dateService.UtcNow,
      UserId = user.Id
    };

    UpsertResult result = await _repository.UpsertJournal(journal);

    user.FavoriteJournalIds.Add(result.EntityId);
  }
}
