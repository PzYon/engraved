using Engraved.Core.Domain.Journals;

namespace Engraved.Persistence.Mongo.DocumentTypes.Journals;

public class ThresholdDefinitionDocument
{
  public double Value { get; set; }
  
  public ThresholdScope Scope {get; set;}
}
