using System.Reflection;

namespace Engraved.Core.Application.Persistence.Demo;

// source: https://stackoverflow.com/questions/129389/how-do-you-do-a-deep-copy-of-an-object-in-net

public static class ObjectExtensions
{
  private static readonly MethodInfo CloneMethod = typeof(object).GetMethod(
    "MemberwiseClone",
    BindingFlags.NonPublic | BindingFlags.Instance
  )!;

  private static bool IsPrimitive(this Type type)
  {
    return type == typeof(string) || type.IsValueType & type.IsPrimitive;
  }

  private static object? Copy(this object? originalObject)
  {
    return InternalCopy(originalObject, new Dictionary<object, object>(new ReferenceEqualityComparer()));
  }

  private static object? InternalCopy(object? originalObject, IDictionary<object, object> visited)
  {
    if (originalObject == null)
    {
      return null;
    }

    Type typeToReflect = originalObject.GetType();
    if (IsPrimitive(typeToReflect))
    {
      return originalObject;
    }

    if (visited.TryGetValue(originalObject, out object? o))
    {
      return o;
    }

    if (typeof(Delegate).IsAssignableFrom(typeToReflect))
    {
      return null;
    }

    object cloneObject = CloneMethod.Invoke(originalObject, null)!;
    if (typeToReflect.IsArray)
    {
      Type arrayType = typeToReflect.GetElementType()!;
      if (IsPrimitive(arrayType) == false)
      {
        var clonedArray = (Array)cloneObject;
        clonedArray.ForEach(
          (array, indices) => array.SetValue(InternalCopy(clonedArray.GetValue(indices), visited), indices)
        );
      }
    }

    visited.Add(originalObject, cloneObject);
    CopyFields(originalObject, visited, cloneObject, typeToReflect);
    RecursiveCopyBaseTypePrivateFields(originalObject, visited, cloneObject, typeToReflect);
    return cloneObject;
  }

  private static void RecursiveCopyBaseTypePrivateFields(
    object originalObject,
    IDictionary<object, object> visited,
    object cloneObject,
    Type typeToReflect
  )
  {
    if (typeToReflect.BaseType != null)
    {
      RecursiveCopyBaseTypePrivateFields(originalObject, visited, cloneObject, typeToReflect.BaseType);
      CopyFields(
        originalObject,
        visited,
        cloneObject,
        typeToReflect.BaseType,
        BindingFlags.Instance | BindingFlags.NonPublic,
        info => info.IsPrivate
      );
    }
  }

  private static void CopyFields(
    object originalObject,
    IDictionary<object, object> visited,
    object cloneObject,
    Type typeToReflect,
    BindingFlags bindingFlags =
      BindingFlags.Instance | BindingFlags.NonPublic | BindingFlags.Public | BindingFlags.FlattenHierarchy,
    Func<FieldInfo, bool>? filter = null
  )
  {
    foreach (FieldInfo fieldInfo in typeToReflect.GetFields(bindingFlags))
    {
      if (filter != null && filter(fieldInfo) == false)
      {
        continue;
      }

      if (IsPrimitive(fieldInfo.FieldType))
      {
        continue;
      }

      object? originalFieldValue = fieldInfo.GetValue(originalObject);
      object? clonedFieldValue = InternalCopy(originalFieldValue, visited);
      fieldInfo.SetValue(cloneObject, clonedFieldValue);
    }
  }

  public static T Copy<T>(this T original)
  {
    return (T)Copy((object)original!)!;
  }
}

public class ReferenceEqualityComparer : EqualityComparer<object>
{
  public override bool Equals(object? x, object? y)
  {
    return ReferenceEquals(x, y);
  }

  public override int GetHashCode(object? obj)
  {
    if (obj == null)
    {
      return 0;
    }

    return obj.GetHashCode();
  }
}

public static class ArrayExtensions
{
  public static void ForEach(this Array array, Action<Array, int[]> action)
  {
    if (array.LongLength == 0)
    {
      return;
    }

    var walker = new ArrayTraverse(array);
    do
    {
      action(array, walker.Position);
    } while (walker.Step());
  }
}

internal class ArrayTraverse
{
  public int[] Position;
  private readonly int[] _maxLengths;

  public ArrayTraverse(Array array)
  {
    _maxLengths = new int[array.Rank];
    for (var i = 0; i < array.Rank; ++i)
    {
      _maxLengths[i] = array.GetLength(i) - 1;
    }

    Position = new int[array.Rank];
  }

  public bool Step()
  {
    for (var i = 0; i < Position.Length; ++i)
    {
      if (Position[i] < _maxLengths[i])
      {
        Position[i]++;
        for (var j = 0; j < i; j++)
        {
          Position[j] = 0;
        }

        return true;
      }
    }

    return false;
  }
}
