using System.Threading.Tasks;
using Engraved.Api.Authentication;
using Engraved.Api.Authentication.Google;

namespace Engraved.Api.Tests.Authentication;

public class FakeGoogleTokenValidator : IGoogleTokenValidator
{
  private readonly string _imageUrl;
  private readonly string _userName;
  private readonly string _displayName;

  public FakeGoogleTokenValidator(string imageUrl, string userName, string displayName)
  {
    _imageUrl = imageUrl;
    _userName = userName;
    _displayName = displayName;
  }

  public Task<ParsedToken> ParseAndValidate(string token)
  {
    return Task.FromResult(
      new ParsedToken
      {
        ImageUrl = _imageUrl,
        UserName = _userName,
        UserDisplayName = _displayName
      }
    );
  }
}
