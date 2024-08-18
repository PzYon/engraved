using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Queries.Journals.GetThresholdValues;

public class ThresholdResult
{
  public ThresholdDefinition ThresholdDefinition { get; set; }
  
  public double ActualValue { get; set; }
}
