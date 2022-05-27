namespace Metrix.Api.Authentication;

public interface ILoginHandler
{
  Task<AuthResult> Login(string? token);
}
