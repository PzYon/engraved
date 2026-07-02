using Engraved.Api.Authentication.Google;
using Engraved.Core.Application;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Users;

namespace Engraved.Api.Authentication;

public class LoginHandler(
  IGoogleTokenValidator tokenValidator,
  IUnrestrictedRepository unrestrictedRepository,
  IDateService dateService,
  UserLoader userLoader,
  JwtTokenFactory jwtTokenFactory,
  RefreshTokenService refreshTokenService
)
  : ILoginHandler
{
  public async Task<AuthResult> Login(string? idToken)
  {
    if (string.IsNullOrEmpty(idToken))
    {
      throw new ArgumentException("Token is null or empty, cannot login.");
    }

    ParsedToken parsedToken = await tokenValidator.ParseAndValidate(idToken);

    IUser user = await EnsureUser(parsedToken.UserName, parsedToken.UserDisplayName, parsedToken.ImageUrl);

    userLoader.SetUser(user);

    DateTime expiresAt = jwtTokenFactory.GetAccessTokenExpiry();

    return new AuthResult
    {
      JwtToken = jwtTokenFactory.CreateAccessToken(parsedToken.UserName, expiresAt),
      ExpiresAt = expiresAt,
      RefreshToken = await refreshTokenService.Issue(user),
      User = user
    };
  }

  public async Task<AuthResult> LoginForTests(string? userName)
  {
    if (string.IsNullOrEmpty(userName))
    {
      throw new ArgumentException($"{nameof(userName)} is null, maybe you are not running test mode?", nameof(userName));
    }

    IUser user = await EnsureUser(userName, userName, null);

    return new AuthResult
    {
      User = user,
      JwtToken = userName,
      ExpiresAt = jwtTokenFactory.GetAccessTokenExpiry()
    };
  }

  private async Task<IUser> EnsureUser(string userName, string? displayName, string? imageUrl)
  {
    IUser user = await unrestrictedRepository.GetUser(userName)
                 ?? new User { Name = userName };

    user.DisplayName = displayName;
    user.ImageUrl = imageUrl;
    user.LastLoginDate = dateService.UtcNow;
    user.GlobalUniqueId ??= Guid.NewGuid();

    if (user.FavoriteJournalIds.Count == 0)
    {
      await EnsureQuickScraps(user);
    }

    UpsertResult result = await unrestrictedRepository.UpsertUser(user);
    user.Id = result.EntityId;
    return user;
  }

  private async Task EnsureQuickScraps(IUser user)
  {
    IJournal journal = new ScrapsJournal
    {
      Name = "Quick Scraps",
      EditedOn = dateService.UtcNow,
      UserId = user.Id
    };

    UpsertResult result = await unrestrictedRepository.UpsertJournal(journal);

    user.FavoriteJournalIds.Add(result.EntityId);
  }
}
