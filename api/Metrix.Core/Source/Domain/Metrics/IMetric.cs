using Metrix.Core.Domain.Permissions;

namespace Metrix.Core.Domain.Metrics;

public interface IMetric : IUserScoped, IPermissionHolder
{
  string? Id { get; set; }

  string Name { get; set; }

  string? Description { get; set; }

  string? Notes { get; set; }

  MetricType Type { get; }

  Dictionary<string, MetricAttribute> Attributes { get; set; }

  Dictionary<string, Dictionary<string, double>> Thresholds { get; set; }

  DateTime? EditedOn { get; set; }

  // basic idea here is to enable clients to store whatever they want while
  // the server is completely unaware of what's going on here. i.e. server
  // does not know, what he's actually storing. this way there's also no
  // server side serialization required, etc.
  Dictionary<string, string> CustomProps { get; set; }
}
