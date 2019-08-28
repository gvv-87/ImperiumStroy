//------------------------------------------------------------------------------
// <auto-generated>
//   This code was generated by a tool.
//
//    Umbraco.ModelsBuilder v3.0.10.102
//
//   Changes to this file will be lost if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Web;
using Umbraco.Core.Models;
using Umbraco.Core.Models.PublishedContent;
using Umbraco.Web;
using Umbraco.ModelsBuilder;
using Umbraco.ModelsBuilder.Umbraco;

namespace Umbraco.Web.PublishedContentModels
{
	/// <summary>Виды ремонтов квартир</summary>
	[PublishedContentModel("service_Category_Page")]
	public partial class Service_Category_Page : PublishedContentModel, INavigatable, ISeoBase, ISitemapBase, IUrlNavigation
	{
#pragma warning disable 0109 // new is redundant
		public new const string ModelTypeAlias = "service_Category_Page";
		public new const PublishedItemType ModelItemType = PublishedItemType.Content;
#pragma warning restore 0109

		public Service_Category_Page(IPublishedContent content)
			: base(content)
		{ }

#pragma warning disable 0109 // new is redundant
		public new static PublishedContentType GetModelContentType()
		{
			return PublishedContentType.Get(ModelItemType, ModelTypeAlias);
		}
#pragma warning restore 0109

		public static PublishedPropertyType GetModelPropertyType<TValue>(Expression<Func<Service_Category_Page, TValue>> selector)
		{
			return PublishedContentModelUtility.GetModelPropertyType(GetModelContentType(), selector);
		}

		///<summary>
		/// Навигационный заголовок: Заголовок для навигационных элементов
		///</summary>
		[ImplementPropertyType("naviTitle")]
		public string NaviTitle
		{
			get { return Umbraco.Web.PublishedContentModels.Navigatable.GetNaviTitle(this); }
		}

		///<summary>
		/// Убрать из навигации: Не показывать ссылку в навигационных элементах
		///</summary>
		[ImplementPropertyType("umbracoNavihide")]
		public bool UmbracoNavihide
		{
			get { return Umbraco.Web.PublishedContentModels.Navigatable.GetUmbracoNavihide(this); }
		}

		///<summary>
		/// Meta Description: Описание для поисковиков.  До 155 символов желательно.
		///</summary>
		[ImplementPropertyType("seoMetaDescription")]
		public string SeoMetaDescription
		{
			get { return Umbraco.Web.PublishedContentModels.SeoBase.GetSeoMetaDescription(this); }
		}

		///<summary>
		/// No follow: Запретить поисковым роботам переходить по ссылкам на странице
		///</summary>
		[ImplementPropertyType("seoNoFollow")]
		public bool SeoNoFollow
		{
			get { return Umbraco.Web.PublishedContentModels.SeoBase.GetSeoNoFollow(this); }
		}

		///<summary>
		/// No index: Запретить индексацию страницы поисковым роботам
		///</summary>
		[ImplementPropertyType("seoNoIndex")]
		public bool SeoNoIndex
		{
			get { return Umbraco.Web.PublishedContentModels.SeoBase.GetSeoNoIndex(this); }
		}

		///<summary>
		/// Title: Заголовок во вкладке браузера и сниппете поисковиков
		///</summary>
		[ImplementPropertyType("seoTitle")]
		public string SeoTitle
		{
			get { return Umbraco.Web.PublishedContentModels.SeoBase.GetSeoTitle(this); }
		}

		///<summary>
		/// Убрать из Sitemap: Не выводить страницу в sitemap.xml
		///</summary>
		[ImplementPropertyType("excludeFromSitemap")]
		public bool ExcludeFromSitemap
		{
			get { return Umbraco.Web.PublishedContentModels.SitemapBase.GetExcludeFromSitemap(this); }
		}

		///<summary>
		/// Альтернативный URL: Переопределить относительную ссылку на страницу
		///</summary>
		[ImplementPropertyType("umbracoUrlName")]
		public string UmbracoUrlName
		{
			get { return Umbraco.Web.PublishedContentModels.UrlNavigation.GetUmbracoUrlName(this); }
		}
	}
}
