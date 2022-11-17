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

  Dictionary<string, object> UiSettings { get; set; }
}
