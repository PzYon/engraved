namespace Engraved.Api.Authentication.Google;

public class GoogleTokenValidationException(string message) : Exception(message), ITokenValidationException;
