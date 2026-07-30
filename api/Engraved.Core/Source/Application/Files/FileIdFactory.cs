using System.Security.Cryptography;
using System.Text;

namespace Engraved.Core.Application.Files;

public class FileIdFactory(string signingKey) : IFileIdFactory
{
  private const char Separator = '.';

  // Truncated to keep blob names short. 128 bits is far beyond what forging a signature by trial
  // would need, and an attacker gets no feedback to iterate against anyway.
  private const int SignatureLength = 22;

  public string Create(string userId)
  {
    var value = Guid.NewGuid().ToString("N");

    return value + Separator + Sign(value, userId);
  }

  public bool BelongsToUser(string fileId, string userId)
  {
    if (string.IsNullOrEmpty(fileId) || string.IsNullOrEmpty(userId))
    {
      return false;
    }

    var separatorIndex = fileId.IndexOf(Separator);
    if (separatorIndex <= 0 || separatorIndex == fileId.Length - 1)
    {
      return false;
    }

    var value = fileId[..separatorIndex];
    var signature = fileId[(separatorIndex + 1)..];

    // Fixed-time comparison: a plain string comparison leaks how much of the signature matched.
    return CryptographicOperations.FixedTimeEquals(
      Encoding.UTF8.GetBytes(signature),
      Encoding.UTF8.GetBytes(Sign(value, userId))
    );
  }

  private string Sign(string value, string userId)
  {
    // The separator between the parts keeps ("ab", "c") from signing the same as ("a", "bc").
    var payload = Encoding.UTF8.GetBytes(value + Separator + userId);

    var hash = HMACSHA256.HashData(Encoding.UTF8.GetBytes(signingKey), payload);

    return Convert.ToBase64String(hash)
      .Replace('+', '-')
      .Replace('/', '_')
      .TrimEnd('=')[..SignatureLength];
  }
}
