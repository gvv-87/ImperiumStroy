using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;
using Umbraco.Core.Services;
using Umbraco.Web;
using Umbraco.Web.Macros;
using Umbraco.Web.PublishedContentModels;

namespace Umbraco.Core.Models
{
    public static class PublishedContentExtensions
    {
        public static IEnumerable<IPublishedContent> VisibleChildren(this IPublishedContent publishedContent)
        {
            return from node in publishedContent.Children
                   where node.IsVisible()
                   select node;
        }

        public static IEnumerable<TContentType> VisibleChildren<TContentType>(this IPublishedContent publishedContent)
            where TContentType : class, IPublishedContent
        {
            return from node in publishedContent.Children<TContentType>()
                   where node.IsVisible()
                   select node;
        }

        // Get page Navigation title (NaviTitle) or page Name
        public static string NavigationTitle(this IPublishedContent publishedContent)
        {
            INavigatable navigation = publishedContent as INavigatable;

            if(navigation != null)
            {
                if(!navigation.NaviTitle.IsNullOrWhiteSpace())
                {
                    return navigation.NaviTitle;
                }
                else
                {
                    return publishedContent.Name;
                }
            }
            else
            {
                return publishedContent.Name;
            }
        }

        // Получить страницы связанные по alias связи
        public static IEnumerable<IPublishedContent> GetRelatedPages(this IPublishedContent publishedContent, string relationTypeAlias)
        {
            UmbracoHelper uHelper = new UmbracoHelper(UmbracoContext.Current);
            IRelationService relationService = ApplicationContext.Current.Services.RelationService; 
            IRelationType relationType = relationService.GetRelationTypeByAlias(relationTypeAlias);
         
            // Получаем объекты отношений по типу отношений
            IEnumerable<IRelation> relations = relationService.GetByParentOrChildId(publishedContent.Id)
                .Where(x => x.RelationTypeId == relationType.Id);

            List<IPublishedContent> result = new List<IPublishedContent>();

            foreach (var relation in relations)
            {
                int id = (relation.ParentId == publishedContent.Id) ? relation.ChildId : relation.ParentId; // Проверяем ссылается ли сама на себя
                IPublishedContent page = uHelper.TypedContent(id);
                page.IfNotNull(x => result.Add(page));
            }

            return result;
        }

        // Get related pages by "relateDocumentLanguage" relation type alias
        public static IEnumerable<IPublishedContent> GetRelatedLanguages(this IPublishedContent publishedContent)
        {
            return publishedContent.GetRelatedPages("relateDocumentLanguage")
                .Where(x => x != publishedContent); // Exclude selflinked documents
        }

        public static IPublishedContent GetParent(this IPublishedContent publishedContent)
        {
            int? currentPageId = UmbracoContext.Current.PageId; // Получили ID текущей страницы
            var uHelper = new UmbracoHelper(UmbracoContext.Current);

            return uHelper.TypedContent(currentPageId); // Возвращаем типизированную страницу
        }

        // Получить хлебные крошки
        // Выводит только навигационные (INavigatable) и видимые (isVisible) узлы
        public static IEnumerable<NaviItem> Breadcrumbs(this IPublishedContent publishedContent)
        {
            if(publishedContent != null)
            {
                return (from node in publishedContent.Ancestors<INavigatable>()
                        where node.IsVisible()
                        select new NaviItem(node)).Reverse();
            }
            else
            {
                return Enumerable.Empty<NaviItem>();
            }            
        }

        // Convert collection of IPublishedContent to NaviItem with unique anchors urls
        public static IEnumerable<NaviItem> AnchorNavigation(this IEnumerable<IPublishedContent> sections)
        {
            if (sections != null)
            {
                return
                    from item in sections
                    where item.IsVisible()
                    select item.ToAnchor();
            }
            else
            {
                return Enumerable.Empty<NaviItem>();
            }
        }

        public static NaviItem ToAnchor(this IPublishedContent publishedContent)
        {
            if(publishedContent != null)
            {
                return new NaviItem(publishedContent.NavigationTitle(), "#" + publishedContent.NavigationTitle().ToSafeAlias());
            }
            else
            {
                return new NaviItem(String.Empty, "#");
            }
        }

        public struct NaviItem
        {
            public NaviItem(string naviTitle, string url)
            {
                Title = naviTitle;
                Url = url;
            }

            public NaviItem(IPublishedContent publishedContent)
            {
                Title = publishedContent.NavigationTitle();
                Url = publishedContent.Url;
            }

            public string Title { get; }
            public string Url { get; }
        }

        // Get page h1 heading (IHeadingBase.SeoTopHeader) as HtmlString, or just Name (IPublishedContent.Name)
        public static IHtmlString TopHeading(this IPublishedContent publishedContent)
        {
            //IHeadingBase heading = publishedContent as IHeadingBase;

            //if (heading != null)
            //{
            //    if (!heading.SeoTopHeader.IsNullOrWhiteSpace())
            //    {
            //        return new HtmlString(Regex.Replace(heading.SeoTopHeader, @"(\r\n)|\n|\r", "<br/>"));
            //    }
            //    else
            //    {
            //        return new HtmlString(publishedContent.NavigationTitle());
            //    }
            //}
            //else
            //{
                return new HtmlString(publishedContent.NavigationTitle());
            //}
        }

        // Check the collection has elements avaliable
        public static bool HasAny(this IEnumerable<object> collection)
        {
            return collection != null && collection.Any();
        }


        #region Safe Images

        // Safe Image wrapper
        public class SafeImage
        {
            IPublishedContent _content;
            string _url = string.Empty;

            public SafeImage(IPublishedContent publishedContent)
            {
                _content = publishedContent;
                _url = publishedContent.IsSafeImage() ? publishedContent.Url : "#";
            }

            public SafeImage(IPublishedContent publishedContent, int width, int? height = null)
            {
                _content = publishedContent;
                _url = publishedContent.IsSafeImage() ? publishedContent.GetCropUrl(width, height) : "#";
            }

            public SafeImage(IPublishedContent publishedContent, string cropAlias)
            {
                _content = publishedContent;
                _url = publishedContent.IsSafeImage() ? publishedContent.GetCropUrl(cropAlias) : "#";
            }

            public IPublishedContent Content { get => _content; }
            public string Url { get => _url; }
        }

        // Check the IPublishedContent is Image and file is not deleted or thrashed
        public static bool IsSafeImage(this IPublishedContent publishedContent)
        {
            if (publishedContent != null && publishedContent is Image)
            {
                return publishedContent.OfType<Image>().UmbracoFile != null ? true : false;
            }
            else return false;
        }

        // Check the IPublishedContent is Image and file does exists
        public static SafeImage ToSafeImage(this IPublishedContent publishedContent)
        {
            return new SafeImage(publishedContent);
        }

        // Check the IPublishedContent is Image and file does exists & crop the Image
        public static SafeImage ToSafeImage(this IPublishedContent publishedContent, int width, int? height = null)
        {
            return new SafeImage(publishedContent, width, height);
        }

        public static SafeImage ToSafeImage(this IPublishedContent publishedContent, string cropAlias)
        {
            return new SafeImage(publishedContent, cropAlias);
        }

        // Convert Media collection to SafeImage Collection, not-images throws out
        public static IEnumerable<SafeImage> ToSafeImages(this IEnumerable<IPublishedContent> mediaCollection)
        {
            if (mediaCollection != null && mediaCollection.Any())
            {
                return
                    from media in mediaCollection
                    where media.IsSafeImage()
                    select new SafeImage(media);
            }
            else return Enumerable.Empty<SafeImage>();
        }


        #region Safe images from Macros

        // Convert Multiple Media Picker macroparameter to SafeImages
        public static IEnumerable<SafeImage> ToSafeImages(this object macroParameter)
        {
            string[] IDs = macroParameter.ToString().Split(',');
            UmbracoHelper uHelper = new UmbracoHelper(UmbracoContext.Current);
            return uHelper.TypedMedia(IDs).Select(media => media.ToSafeImage());
        }

        // Convert Single Media Picker macroparameter to an SafeImage
        public static SafeImage ToSafeImage(this object macroParameter)
        {          
            string ID = macroParameter.ToString();
            UmbracoHelper uHelper = new UmbracoHelper(UmbracoContext.Current);
            return uHelper.TypedMedia(ID).ToSafeImage();
        }

        #endregion

        #endregion
    }
}
