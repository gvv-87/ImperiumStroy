using System.Web.Mvc;
using Umbraco.Web;
using Umbraco.Web.Models;
using Umbraco.Web.Mvc;

namespace PoLibrary.Controllers
{
    public class RedirectToFirstChildController: RenderMvcController
    {
        public override ActionResult Index(RenderModel model)
        {
            return new RedirectToUmbracoPageResult(model.Content.FirstChild());
        }
    }
}
