using Engraved.Core.Application.Files;
using FluentAssertions;
using NUnit.Framework;

namespace Engraved.Core.Tests.Application.Files;

public class FileContentPolicyShould
{
  [TestCase("image/png")]
  [TestCase("image/jpeg")]
  [TestCase("IMAGE/PNG")]
  [TestCase("application/pdf")]
  public void Render_KnownSafeTypes_Inline(string contentType)
  {
    FileContentPolicy.GetDisposition(contentType).Should().Be(FileDisposition.Inline);
  }

  // An SVG can carry <script>, which would run if the browser navigated to it as a document. It
  // still displays in scraps regardless, because an <img> renders SVG script-free and ignores the
  // content disposition - only clicking through turns into a download.
  [Test]
  public void Force_Svg_ToDownload()
  {
    FileContentPolicy.GetDisposition("image/svg+xml").Should().Be(FileDisposition.Attachment);
  }

  [TestCase("text/html")]
  [TestCase("application/zip")]
  [TestCase("application/octet-stream")]
  public void Force_EverythingElse_ToDownload(string contentType)
  {
    FileContentPolicy.GetDisposition(contentType).Should().Be(FileDisposition.Attachment);
  }

  // The file name ends up inside a quoted Content-Disposition header, so anything that could close
  // the quotes or start a new header line has to go.
  [TestCase("plain.png", "plain.png")]
  [TestCase("with\"quote.png", "withquote.png")]
  [TestCase("with\\backslash.png", "withbackslash.png")]
  [TestCase("break\r\nX-Injected: 1.png", "breakX-Injected: 1.png")]
  [TestCase("  padded.png  ", "padded.png")]
  [TestCase("\"\"", "download")]
  public void Sanitize_FileNames(string input, string expected)
  {
    FileContentPolicy.SanitizeFileName(input).Should().Be(expected);
  }
}
