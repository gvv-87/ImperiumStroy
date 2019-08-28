using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Umbraco.Core;
using Umbraco.Core.Models;
using Umbraco.Web.Models;
using Umbraco.Web.PublishedContentModels;

namespace PoLibrary.Models
{
    public interface IOverview<TChild>
        where TChild : class, IPublishedContent
    {
        int Page { get; set; }
        int Size { get; set; }
        int Total { get; }
        IEnumerable<TChild> Pages { get; set; }       
    }
}
