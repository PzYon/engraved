using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace Metrix.Api.Controllers;

// https://blog.zhaytam.com/2019/10/03/google-sign-in-asp-net-core-web-api/

public class MyToken
{
  public string Token { get; set; }
}

[ApiController]
[Route("api/auth")]
[AllowAnonymous]
public class AuthController : Controller
{
  public static readonly string Secret = "must-be-replaced";

  [HttpPost("google")]
  [ProducesDefaultResponseType]
  public async Task<MyToken> GoogleLogin(string token)
  {
    var validationSettings = new GoogleJsonWebSignature.ValidationSettings
    {
      Audience = new[] {"147930987098-feu514ne5nol9fhdpd2p3sm3fnj2eicf.apps.googleusercontent.com"}
    };

    GoogleJsonWebSignature.Payload? payload = await GoogleJsonWebSignature.ValidateAsync(
      token,
      validationSettings
    );

    string myToken = GenerateToken(payload.Email);

    return new MyToken() {Token = myToken};
  }

  private string GenerateToken(string userId)
  {
    var mySecurityKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(Secret));
    var tokenDescriptor = new SecurityTokenDescriptor
    {
      Subject = new ClaimsIdentity(new[] {new Claim(ClaimTypes.NameIdentifier, userId)}),
      Expires = DateTime.UtcNow.AddDays(7),
      Issuer = "http://mysite.com",
      Audience = "http://myaudience.com",
      SigningCredentials = new SigningCredentials(mySecurityKey, SecurityAlgorithms.HmacSha256Signature)
    };

    var tokenHandler = new JwtSecurityTokenHandler();
    return tokenHandler.WriteToken(tokenHandler.CreateToken(tokenDescriptor));
  }
}

public class MyTokenMiddleware
{
  private readonly RequestDelegate _next;

  public MyTokenMiddleware(RequestDelegate next)
  {
    _next = next;
  }

  public Task InvokeAsync(HttpContext context)
  {
    var header = context.Request.Headers["Authorization"];
    if (header.Count == 0)
    {
      throw new Exception("Authorization header is empty");
    }

    string[] tokenValue = Convert.ToString(header).Trim().Split(" ");
    if (tokenValue.Length <= 1)
    {
      throw new Exception();
    }

    string token = tokenValue[1];

    var tokenHandler = new JwtSecurityTokenHandler();
    var key = Encoding.ASCII.GetBytes(AuthController.Secret);

    tokenHandler.ValidateToken(
      token,
      new TokenValidationParameters
      {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = false,
        ValidateAudience = false,
        // set clockskew to zero so tokens expire exactly at token expiration time (instead of 5 minutes later)
        ClockSkew = TimeSpan.Zero
      },
      out SecurityToken validatedToken
    );

    var jwtToken = (JwtSecurityToken) validatedToken;

    var x = jwtToken.Claims.First(x => x.Type == "nameidentifier").Value;
    
    return Task.CompletedTask;
  }
}
