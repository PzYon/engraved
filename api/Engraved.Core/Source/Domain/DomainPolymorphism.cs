using System.Text.Json.Serialization.Metadata;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Domain;

// System.Text.Json serializes based on the DECLARED type, so values declared as IEntry,
// IJournal or IEntity (controller responses and nested properties) would silently lose all
// runtime-type-specific properties (e.g. GaugeEntry.Value, BaseJournal.UserRole) without
// polymorphism configuration.
//
// The derived types are discovered via reflection instead of [JsonDerivedType] attributes,
// so new entry/journal types are picked up automatically and cannot be forgotten. No type
// discriminator is emitted, so the JSON shape stays unchanged.
public static class DomainPolymorphism
{
  private static readonly Type[] PolymorphicBaseTypes = [typeof(IEntity), typeof(IEntry), typeof(IJournal)];

  // Modifier for a DefaultJsonTypeInfoResolver; wired into the MVC JSON options in Program.cs.
  public static void ConfigurePolymorphism(JsonTypeInfo jsonTypeInfo)
  {
    Type[] derivedTypes = GetDerivedTypes(jsonTypeInfo.Type);
    if (derivedTypes.Length == 0)
    {
      return;
    }

    var polymorphismOptions = new JsonPolymorphismOptions();

    foreach (Type derivedType in derivedTypes)
    {
      polymorphismOptions.DerivedTypes.Add(new JsonDerivedType(derivedType));
    }

    jsonTypeInfo.PolymorphismOptions = polymorphismOptions;
  }

  // Also used by Swagger (SelectSubTypesUsing) so the schema exposes the same derived types.
  // Returns an empty array for any type that is not one of the polymorphic base types.
  public static Type[] GetDerivedTypes(Type baseType)
  {
    if (!PolymorphicBaseTypes.Contains(baseType))
    {
      return [];
    }

    return baseType.Assembly
      .GetTypes()
      .Where(t => t is { IsAbstract: false, IsInterface: false } && baseType.IsAssignableFrom(t))
      .OrderBy(t => t.FullName)
      .ToArray();
  }
}
