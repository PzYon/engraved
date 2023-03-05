namespace Engraved.Api.Authentication.Google;

public interface IGoogleTokenValidator
{
  Task<ParsedToken> ParseAndValidate(string idToken);
}
