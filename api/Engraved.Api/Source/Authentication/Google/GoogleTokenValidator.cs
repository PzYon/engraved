using Google.Apis.Auth;
using Engraved.Api.Settings;
using Microsoft.Extensions.Options;

namespace Engraved.Api.Authentication.Google;

public class GoogleTokenValidator : IGoogleTokenValidator
{
  private readonly AuthenticationConfig _authenticationConfig;

  public GoogleTokenValidator(IOptions<AuthenticationConfig> configuration) : this(configuration.Value) { }

  public GoogleTokenValidator(AuthenticationConfig configuration)
  {
    _authenticationConfig = configuration;
  }

  public async Task<ParsedToken> ParseAndValidate(string token)
  {
    if (string.IsNullOrEmpty(_authenticationConfig.GoogleClientId))
    {
      throw new ArgumentException(
        $"\"{nameof(AuthenticationConfig.GoogleClientId)}\" is not set, please do so in your environment settings."
      );
    }

    try
    {
      var validationSettings = new GoogleJsonWebSignature.ValidationSettings
      {
        Audience = new[] { _authenticationConfig.GoogleClientId }
      };

      GoogleJsonWebSignature.Payload? payload = await GoogleJsonWebSignature.ValidateAsync(token, validationSettings);

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
