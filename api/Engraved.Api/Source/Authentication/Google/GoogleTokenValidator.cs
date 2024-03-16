using Engraved.Api.Settings;
using Google.Apis.Auth;
using Microsoft.Extensions.Options;

namespace Engraved.Api.Authentication.Google;

public class GoogleTokenValidator(AuthenticationConfig configuration) : IGoogleTokenValidator
{
  public GoogleTokenValidator(IOptions<AuthenticationConfig> configuration) : this(configuration.Value) { }

  public async Task<ParsedToken> ParseAndValidate(string idToken)
  {
    if (string.IsNullOrEmpty(configuration.GoogleClientId))
    {
      throw new ArgumentException(
        $"\"{nameof(AuthenticationConfig.GoogleClientId)}\" is not set, please do so in your environment settings."
      );
    }

    try
    {
      var validationSettings = new GoogleJsonWebSignature.ValidationSettings
      {
        Audience = new[] { configuration.GoogleClientId }
      };

      GoogleJsonWebSignature.Payload? payload = await GoogleJsonWebSignature.ValidateAsync(idToken, validationSettings);

      return new ParsedToken
      {
        UserName = payload.Email,
        UserDisplayName = payload.Name,
        ImageUrl = payload.Picture
      };
    }
    catch (Exception ex)
    {
      throw new GoogleTokenValidationException($"Failed to validate google token: {ex.Message}");
    }
  }
}
