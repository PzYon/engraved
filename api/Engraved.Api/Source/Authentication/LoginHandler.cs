using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Engraved.Api.Authentication.Google;
using Engraved.Api.Settings;
using Engraved.Core.Application;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Users;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace Engraved.Api.Authentication;

public class LoginHandler(
  IGoogleTokenValidator tokenValidator,
  IBaseRepository repository,
  AuthenticationConfig configuration,
  IDateService dateService,
  UserLoader userLoader
)
  : ILoginHandler
{
  public LoginHandler(
    IGoogleTokenValidator tokenValidator,
    IBaseRepository repository,
    IOptions<AuthenticationConfig> configuration,
    IDateService dateService,
    UserLoader userLoader
  ) : this(tokenValidator, repository, configuration.Value, dateService, userLoader) { }

  public async Task<AuthResult> Login(string? idToken)
  {
    if (string.IsNullOrEmpty(idToken))
    {
      throw new ArgumentException("Token is null or empty, cannot login.");
    }

    ParsedToken parsedToken = await tokenValidator.ParseAndValidate(idToken);

    IUser user = await EnsureUser(parsedToken.UserName, parsedToken.UserDisplayName, parsedToken.ImageUrl);

    userLoader.SetUser(user);

    return new AuthResult
    {
      JwtToken = ToJwtToken(parsedToken.UserName),
      User = user
    };
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

  private async Task<IUser> EnsureUser(string userName, string? displayName, string? imageUrl)
  {
    IUser user = await repository.GetUser(userName)
                 ?? new User { Name = userName };

    user.DisplayName = displayName;
    user.ImageUrl = imageUrl;
    user.LastLoginDate = dateService.UtcNow;
    user.GlobalUniqueId ??= Guid.NewGuid();

    if (user.FavoriteJournalIds.Count == 0)
    {
      await EnsureQuickScraps(user);
    }

    UpsertResult result = await repository.UpsertUser(user);
    user.Id = result.EntityId;
    return user;
  }

  private string ToJwtToken(string userId)
  {
    var tokenDescriptor = new SecurityTokenDescriptor
    {
      Subject = new ClaimsIdentity(GetClaims(userId)),
      IssuedAt = dateService.UtcNow,
      Expires = dateService.UtcNow.AddHours(36),
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
      throw new Exception($"\"{nameof(AuthenticationConfig.JwtSecret)}\" must be set on the config.");
    }

    return new SigningCredentials(
      new SymmetricSecurityKey(Encoding.ASCII.GetBytes(configuration.JwtSecret)),
      SecurityAlgorithms.HmacSha256Signature
    );
  }

  private static Claim[] GetClaims(string userId)
  {
    return [new Claim(ClaimTypes.NameIdentifier, userId)];
  }

  private async Task EnsureQuickScraps(IUser user)
  {
    IJournal journal = new ScrapsJournal
    {
      Name = "Quick Scraps",
      EditedOn = dateService.UtcNow,
      UserId = user.Id
    };

    UpsertResult result = await repository.UpsertJournal(journal);

    user.FavoriteJournalIds.Add(result.EntityId);
  }
}
