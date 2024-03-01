using System.Threading.Tasks;
using Engraved.Api.Authentication;
using Engraved.Api.Authentication.Google;

namespace Engraved.Api.Tests.Authentication;

public class FakeGoogleTokenValidator(string imageUrl, string userName, string displayName) : IGoogleTokenValidator
{
  public Task<ParsedToken> ParseAndValidate(string idToken)
  {
    return Task.FromResult(
      new ParsedToken
      {
        ImageUrl = imageUrl,
        UserName = userName,
        UserDisplayName = displayName
      }
    );
  }
}
