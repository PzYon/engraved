using Engraved.Api.Authentication;
using Engraved.Core.Application;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Engraved.Api.Controllers;

[ApiController]
[Route("api/auth/e2e")]
[Authorize]
public class E2eTestsAuthController : Controller
{
  private readonly ILoginHandler _loginHandler;
  private readonly ICurrentUserService _currentUserService;

  public E2eTestsAuthController(ILoginHandler loginHandler, ICurrentUserService currentUserService)
  {
    _loginHandler = loginHandler;
    _currentUserService = currentUserService;
  }

  [HttpPost]
  public async Task<AuthResult> LoginForTests()
  {
    return await _loginHandler.LoginForTests(_currentUserService.GetUserName());
  }
}
