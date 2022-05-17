using Google.Apis.Auth;
using Metrix.Api.Settings;
using Microsoft.Extensions.Options;

namespace Metrix.Api.Authentication;

public class GoogleTokenValidator
{
  private readonly AuthenticationConfig _authenticationConfig;

  public GoogleTokenValidator(IOptions<AuthenticationConfig> configuration)
  {
    _authenticationConfig = configuration.Value;
  }

  public async Task<ParsedToken> ParseAndValidate(string token)
  {
    var validationSettings = new GoogleJsonWebSignature.ValidationSettings
    {
      Audience = new[] { _authenticationConfig.GoogleClientId }
    };

    GoogleJsonWebSignature.Payload payload = await GoogleJsonWebSignature.ValidateAsync(token, validationSettings);

    return new ParsedToken
    {
      UserName = payload.Name,
      ImageUrl = payload.Picture
    };
  }
}
