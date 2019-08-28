using PoLibrary.Infrastructure;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace PoLibrary.Services
{
    public class RazorViewService : IViewService
    {
        public string RenderPartialViewToString(Controller controller, string viewName, object model)
        {
            controller.ViewData.Model = model;

            try
            {
                using (var sw = new StringWriter())
                {
                    var viewResult = ViewEngines.Engines.FindPartialView(controller.ControllerContext, viewName);

                    if (viewResult?.View == null)
                    {
                        throw new Exception($"Не найдено представление {viewName}");
                    }
                        
                    var viewContext = new ViewContext(controller.ControllerContext, viewResult.View, controller.ViewData, controller.TempData, sw);
                    viewResult.View.Render(viewContext, sw);

                    return sw.GetStringBuilder().ToString();
                }
            }
            catch (Exception ex)
            {                         
                return "<pre>" + ex.Message + "</pre>";
            }
        }
    }
}
