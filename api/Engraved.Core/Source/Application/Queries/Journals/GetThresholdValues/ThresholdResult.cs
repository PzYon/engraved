using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Queries.Journals.GetThresholdValues;

public class ThresholdResult
{
  public ThresholdDefinition ThresholdDefinition { get; set; } = null!;
  
  public double ActualValue { get; set; }
}
