using Engraved.Api.Authentication;
using Engraved.Core.Application;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Engraved.Api.Controllers;

[ApiController]
[Route("api/auth/e2e")]
[Authorize]
public class E2eTestsAuthController(ILoginHandler loginHandler, ICurrentUserService currentUserService)
  : Controller
{
  [HttpPost]
  public async Task<AuthResult> LoginForTests()
  {
    return await loginHandler.LoginForTests(currentUserService.GetUserName());
  }
}
