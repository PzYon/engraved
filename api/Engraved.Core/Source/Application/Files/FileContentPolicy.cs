using System.Text.RegularExpressions;

namespace Engraved.Core.Application.Files;

// Decides how a file may be presented to the browser. Any file type can be stored - the point is
// that arbitrary documents can be put on an entry - but only a known-safe set is allowed to render
// in place; everything else downloads.
public static class FileContentPolicy
{
  // Types the browser renders without executing anything. SVG is deliberately absent: it is an XML
  // document that can carry <script>, and a navigation to it would run that script in the storage
  // account's origin. It still displays fine in scraps, because an <img> renders SVG script-free and
  // ignores the content disposition entirely - only clicking through turns into a download.
  private static readonly HashSet<string> InlineContentTypes = new(StringComparer.OrdinalIgnoreCase)
  {
    "image/png",
    "image/jpeg",
    "image/gif",
    "image/webp",
    "image/avif",
    "application/pdf"
  };

  // Control characters would let a crafted file name inject additional header lines into the
  // Content-Disposition the store writes; quotes and backslashes would break out of the quoted
  // string. Neither is worth trying to encode - file names are cosmetic.
  private static readonly Regex UnsafeFileNameCharacters = new(@"[\p{C}""\\]", RegexOptions.Compiled);

  public static FileDisposition GetDisposition(string contentType)
  {
    return InlineContentTypes.Contains(contentType) ? FileDisposition.Inline : FileDisposition.Attachment;
  }

  public static string SanitizeFileName(string fileName)
  {
    var sanitized = UnsafeFileNameCharacters.Replace(fileName, "").Trim();

    return string.IsNullOrEmpty(sanitized) ? "download" : sanitized;
  }
}
