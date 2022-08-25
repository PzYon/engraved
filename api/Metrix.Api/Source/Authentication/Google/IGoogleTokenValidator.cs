namespace Metrix.Api.Authentication.Google;

public interface IGoogleTokenValidator
{
  Task<ParsedToken> ParseAndValidate(string token);
}
