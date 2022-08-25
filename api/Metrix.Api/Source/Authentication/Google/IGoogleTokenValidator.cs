namespace Metrix.Api.Authentication;

public interface IGoogleTokenValidator
{
  Task<ParsedToken> ParseAndValidate(string token);
}
