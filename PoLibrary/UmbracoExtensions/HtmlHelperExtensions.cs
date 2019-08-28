using System;
using System.Collections.Generic;
using System.Web;
using System.Web.Mvc;
using System.Web.Mvc.Html;
using Umbraco.Core;
using Umbraco.Core.Models;
using Umbraco.Web;

namespace PoLibrary
{
    public static class HtmlHelperExtensions
    {
        public static IHtmlString RenderNestedContent(this HtmlHelper htmlHelper, IEnumerable<IPublishedContent> items)
        {
            if (items != null)
            {
                string result = String.Empty;

                foreach (var item in items)
                {
                    string viewName = "_" + item.DocumentTypeAlias.ToFirstUpper();
                    result += htmlHelper.Partial(viewName, item);
                }

                return MvcHtmlString.Create(result);
            }
            else
            {
                return MvcHtmlString.Empty;
            }
        }

        public static IHtmlString RenderCachedNestedContent(this HtmlHelper htmlHelper, 
            IEnumerable<IPublishedContent> items, int cachedSeconds = 3600, bool cacheByPage = true)
        {
            if (items != null)
            {
                string result = String.Empty;

                foreach (var item in items)
                {
                    string viewName = "_" + item.DocumentTypeAlias.ToFirstUpper();
                    result += htmlHelper.CachedPartial(viewName, item, cachedSeconds, cacheByPage);
                }

                return MvcHtmlString.Create(result);
            }
            else
            {
                return MvcHtmlString.Empty;
            }
        }
    }


}