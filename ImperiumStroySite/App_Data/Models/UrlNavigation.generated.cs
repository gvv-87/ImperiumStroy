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
	// Mixin content Type 1076 with alias "urlNavigation"
	/// <summary>Url Navigation</summary>
	public partial interface IUrlNavigation : IPublishedContent
	{
		/// <summary>Альтернативный URL</summary>
		string UmbracoUrlName { get; }
	}

	/// <summary>Url Navigation</summary>
	[PublishedContentModel("urlNavigation")]
	public partial class UrlNavigation : PublishedContentModel, IUrlNavigation
	{
#pragma warning disable 0109 // new is redundant
		public new const string ModelTypeAlias = "urlNavigation";
		public new const PublishedItemType ModelItemType = PublishedItemType.Content;
#pragma warning restore 0109

		public UrlNavigation(IPublishedContent content)
			: base(content)
		{ }

#pragma warning disable 0109 // new is redundant
		public new static PublishedContentType GetModelContentType()
		{
			return PublishedContentType.Get(ModelItemType, ModelTypeAlias);
		}
#pragma warning restore 0109

		public static PublishedPropertyType GetModelPropertyType<TValue>(Expression<Func<UrlNavigation, TValue>> selector)
		{
			return PublishedContentModelUtility.GetModelPropertyType(GetModelContentType(), selector);
		}

		///<summary>
		/// Альтернативный URL: Переопределить относительную ссылку на страницу
		///</summary>
		[ImplementPropertyType("umbracoUrlName")]
		public string UmbracoUrlName
		{
			get { return GetUmbracoUrlName(this); }
		}

		/// <summary>Static getter for Альтернативный URL</summary>
		public static string GetUmbracoUrlName(IUrlNavigation that) { return that.GetPropertyValue<string>("umbracoUrlName"); }
	}
}
