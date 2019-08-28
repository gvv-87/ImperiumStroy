using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace PoLibrary.Infrastructure
{
    public interface IViewService
    {
        string RenderPartialViewToString(Controller controller, string viewName, object model);
    }
}
