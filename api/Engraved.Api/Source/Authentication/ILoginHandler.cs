namespace Engraved.Api.Authentication;

public interface ILoginHandler
{
  Task<AuthResult> Login(string? idToken);

  Task<AuthResult> LoginForTests();
}
