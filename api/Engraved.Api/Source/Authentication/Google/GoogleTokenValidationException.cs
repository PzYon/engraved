namespace Engraved.Api.Authentication.Google;

public class GoogleTokenValidationException : Exception, ITokenValidationException
{
  public GoogleTokenValidationException(string message) : base(message) { }
}
