using System.Linq;

namespace System.Collections.Generic
{
    public static class EnumerableExtensions
    {
        public static IEnumerable<T> GetAs<T>(this IEnumerable collection)
        {
            if(collection != null)
            {
                return collection.Cast<T>();
            }
            else
            {
                return Enumerable.Empty<T>();
            }
        }
    }
}
