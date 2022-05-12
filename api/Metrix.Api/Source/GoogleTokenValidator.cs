using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Google.Apis.Auth;
using Microsoft.IdentityModel.Tokens;

namespace Metrix.Api;

public class GoogleTokenValidator : ISecurityTokenValidator
{
  private readonly JwtSecurityTokenHandler _tokenHandler;

  public GoogleTokenValidator()
  {
    _tokenHandler = new JwtSecurityTokenHandler();
  }

  public bool CanValidateToken => true;

  public int MaximumTokenSizeInBytes { get; set; } = TokenValidationParameters.DefaultMaximumTokenSizeInBytes;

  public bool CanReadToken(string securityToken)
  {
    //return true;
    bool canReadToken = _tokenHandler.CanReadToken(securityToken);
    return canReadToken;
  }

  public ClaimsPrincipal ValidateToken(
    string securityToken,
    TokenValidationParameters validationParameters,
    out SecurityToken validatedToken
    )
  {
    validatedToken = null;
    
    var payload = GoogleJsonWebSignature.ValidateAsync(securityToken, new GoogleJsonWebSignature.ValidationSettings())
      .Result; // here is where I delegate to Google to validate

    var claims = new List<Claim>
    {
      new(ClaimTypes.NameIdentifier, payload.Name),
      new(ClaimTypes.Name, payload.Name),
      new(JwtRegisteredClaimNames.FamilyName, payload.FamilyName),
      new(JwtRegisteredClaimNames.GivenName, payload.GivenName),
      new(JwtRegisteredClaimNames.Email, payload.Email),
      new(JwtRegisteredClaimNames.Sub, payload.Subject),
      new(JwtRegisteredClaimNames.Iss, payload.Issuer),
    };

    validatedToken = new JwtSecurityToken(securityToken);
    
    try
    {
      var principle = new ClaimsPrincipal();
      principle.AddIdentity(new ClaimsIdentity(claims, "Password"));
      return principle;
    }
    catch (Exception e)
    {
      Console.WriteLine(e);
      throw;
    }
  }
}
