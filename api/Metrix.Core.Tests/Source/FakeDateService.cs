using System;
using Metrix.Core.Application;

namespace Metrix.Core;

public class FakeDateService : IDateService
{
  public DateTime UtcNow { get; set; } = DateTime.UtcNow;
}
