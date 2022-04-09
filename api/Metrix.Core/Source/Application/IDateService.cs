namespace Metrix.Core.Application;

public interface IDateService
{
  public DateTime UtcNow { get; }
}

public class DateService : IDateService
{
  public DateTime UtcNow { get; } = DateTime.UtcNow;
}
