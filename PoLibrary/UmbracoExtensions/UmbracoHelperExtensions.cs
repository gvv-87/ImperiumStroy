using System.Collections.Generic;
using System.Linq;
using Umbraco.Core.Models;
using Umbraco.Web;

namespace Umbraco.Web
{
    public static class UmbracoHelperExtensions
    { 
        public static IEnumerable<TContentType> GetRootNodesOfType<TContentType>(this UmbracoHelper uHelper)
            where TContentType : class, IPublishedContent
        {
            return uHelper.TypedContentAtRoot().OfType<TContentType>();
        }

        public static TContentType GetSingleRootNodeOfType<TContentType>(this UmbracoHelper uHelper)
            where TContentType : class, IPublishedContent
        {
            return uHelper.TypedContentAtRoot().OfType<TContentType>().First();
        }
    } 
}
