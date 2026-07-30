namespace Engraved.Storage.Azure;

public static class SasExpiry
{
  // An upload URL is used immediately by the client that asked for it, so it does not need to
  // survive long and is never worth caching.
  public static readonly TimeSpan UploadValidity = TimeSpan.FromMinutes(15);

  private static readonly TimeSpan MinimumReadValidity = TimeSpan.FromMinutes(15);

  // Read URLs are rounded up to a full hour so that everyone asking for the same file within the
  // same window gets a byte-identical URL. Without that, every request would produce a new signature,
  // the URL would differ on every render, and the browser (and the service worker) could never reuse
  // a response - each view of a scrap would re-download every image in it.
  //
  // The minimum offset keeps a request made just before the hour from receiving a URL that is
  // already about to expire.
  public static DateTimeOffset GetReadExpiry(DateTimeOffset now)
  {
    DateTimeOffset earliest = now.Add(MinimumReadValidity);

    return new DateTimeOffset(
      earliest.Year,
      earliest.Month,
      earliest.Day,
      earliest.Hour,
      0,
      0,
      earliest.Offset
    ).AddHours(1);
  }
}
