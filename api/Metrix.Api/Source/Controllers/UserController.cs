using Metrix.Core.Application.Persistence;
using Metrix.Core.Domain.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Metrix.Api.Controllers;

[ApiController]
[Route("api/user")]
[Authorize]
public class UserController : Controller
{
  private readonly IUserScopedRepository _userScopedRepository;

  public UserController(IUserScopedRepository userScopedRepository)
  {
    _userScopedRepository = userScopedRepository;
  }

  [HttpGet]
  public IUser GetCurrentUser()
  {
    return _userScopedRepository.CurrentUser.Value;
  }
}
