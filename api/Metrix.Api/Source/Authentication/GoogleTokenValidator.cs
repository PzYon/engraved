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
    if (string.IsNullOrEmpty(_authenticationConfig.GoogleClientId))
    {
      throw new ArgumentException(
        $"\"{nameof(AuthenticationConfig.GoogleClientId)}\" is not set, please do so in your environment settings."
      );
    }
    
    var validationSettings = new GoogleJsonWebSignature.ValidationSettings
    {
      Audience = new[] { _authenticationConfig.GoogleClientId }
    };

    GoogleJsonWebSignature.Payload payload = await GoogleJsonWebSignature.ValidateAsync(token, validationSettings);

    return new ParsedToken
    {
      UserName = payload.Email,
      UserDisplayName = payload.Name,
      ImageUrl = payload.Picture
    };
  }
}
