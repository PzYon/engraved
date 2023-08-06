﻿using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Engraved.Api.Authentication.Google;
using Engraved.Api.Settings;
using Engraved.Core.Application;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Metrics;
using Engraved.Core.Domain.User;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace Engraved.Api.Authentication;

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

  public async Task<AuthResult> Login(string? idToken)
  {
    if (string.IsNullOrEmpty(idToken))
    {
      throw new ArgumentException("Token is null or empty, cannot login.");
    }

    ParsedToken parsedToken = await _tokenValidator.ParseAndValidate(idToken);

    string userName = parsedToken.UserName;

    IUser user = await _repository.GetUser(userName)
                 ?? new User { Name = userName };

    user.DisplayName = parsedToken.UserDisplayName;
    user.ImageUrl = parsedToken.ImageUrl;
    user.LastLoginDate = _dateService.UtcNow;

    if (user.FavoriteMetricIds.Count == 0)
    {
      await EnsureQuickScraps(user);
    }

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
    IMetric metric = new ScrapsMetric
    {
      Name = "Quick Scraps",
      EditedOn = _dateService.UtcNow,
      UserId = user.Id
    };

    UpsertResult result = await _repository.UpsertMetric(metric);

    user.FavoriteMetricIds.Add(result.EntityId);
  }
}
