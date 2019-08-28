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
    public class ContactFormController : SurfaceController
    {

        readonly IEmailService _emailService;
        readonly IViewService _viewRenderer;

        public ContactFormController(IEmailService emailServise, IViewService viewService)
        {
            _emailService = emailServise;
            _viewRenderer = viewService;
        }

        [HttpPost]
        public ActionResult HandleSubmitForm(Feedback feedback, IEnumerable<HttpPostedFileBase> files)
        {
            try
            {
                using (var letter = new MailMessage())
                {
                    letter.Subject = String.Format("#Feedback from {0}", Request.Url.Host);
                    letter.Body = _viewRenderer.RenderPartialViewToString(controller: this, viewName: "_FeedbackLetter", model: feedback);
                    letter.IsBodyHtml = true;
                    files.IfNotNull((attachments) =>
                    {
                        foreach (var item in attachments)
                        {
                            letter.Attachments.Add(new Attachment(item.InputStream, item.FileName));
                        }                       
                    });

                    if (!feedback.Email.IsNullOrWhiteSpace())
                    {
                        letter.ReplyToList.Add(feedback.Email);
                    }

                    _emailService.Send(letter);
                }

                return new HttpStatusCodeResult(HttpStatusCode.OK); // 200
            }
            catch (Exception ex)
            {
                return new HttpStatusCodeResult(HttpStatusCode.InternalServerError); // 500
            }
        }
    }
}