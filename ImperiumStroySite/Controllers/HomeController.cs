using System;
using System.Net;
using System.Net.Mail;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Umbraco.Web.Mvc;
using ImperiumStroy.Models;
using System.Text;
using System.Configuration;
using umbraco;
using Umbraco.Core.Configuration;
using System.Threading.Tasks;
using ContentModels = Umbraco.Web.PublishedContentModels;
using System.IO;
using System.Web.Routing;
using System.Collections.Specialized;
using PoLibrary;
using PoLibrary.Infrastructure;
using Umbraco.Core;


namespace ImperiumStroy.Controllers
{
    public class HomeController : Umbraco.Web.Mvc.SurfaceController
    {
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public ActionResult About()
        {
            return View("~/Views/AboutPage.cshtml", model:ContentModels.BlogPage.ModelItemType.ToString());
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }


    }
}