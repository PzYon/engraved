namespace Metrix.Api.Authentication;

public class GoogleTokenValidationException : Exception, ITokenValidationException
{
  public GoogleTokenValidationException(string message) : base(message) { }
}
