namespace Engraved.Core.Application;

public interface IDateService
{
  public DateTime UtcNow { get; }
}

public class DateService : IDateService
{
  public DateTime UtcNow { get; } = DateTime.UtcNow;
}

public class FakeDateService : IDateService
{
  public FakeDateService() : this(DateTime.UtcNow) { }

  public FakeDateService(DateTime initialDate)
  {
    UtcNow = initialDate;
  }

  public DateTime UtcNow { get; set; }

  public void SetNext(int remainingSteps)
  {
    TimeSpan diffToNow = DateTime.UtcNow - UtcNow;
    double hoursPerStep = diffToNow.TotalHours / remainingSteps;
    var minutesPerStep = Convert.ToInt32(hoursPerStep * 60);
    UtcNow = UtcNow.AddMinutes(Random.Shared.Next(1, minutesPerStep));
  }
}

public class SelfIncrementingDateService : IDateService
{
  private readonly int _initialDayOffset;
  private DateTime _utcNow;

  public SelfIncrementingDateService()
  {
    _initialDayOffset = Random.Shared.Next(100, 600);
    _utcNow = DateTime.UtcNow.AddDays(-_initialDayOffset);
  }

  public DateTime UtcNow
  {
    get
    {
      DateTime next = _utcNow;
      _utcNow = DateTime.UtcNow.AddHours(-Random.Shared.Next(0, _initialDayOffset * 24));
      return next;
    }
  }
}
