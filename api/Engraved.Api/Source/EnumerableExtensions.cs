namespace Engraved.Api;

public static class EnumerableExtensions
{
  // we need to return object here in order for serializer to consider polymorphism
  public static object[] EnsurePolymorphismWhenSerializing<T>(this IEnumerable<T> enumerable)
  {
    return enumerable.Cast<object>().ToArray();
  }
}
