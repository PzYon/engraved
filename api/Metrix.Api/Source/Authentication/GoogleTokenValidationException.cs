namespace Metrix.Api.Authentication;

public class GoogleTokenValidationException : Exception
{
  public GoogleTokenValidationException(string message) : base(message) { }
}
