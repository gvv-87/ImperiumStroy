using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Umbraco.Web;

using Ninject;
using Ninject.Modules;
using Ninject.Web.Mvc;

using PoLibrary;
using PoLibrary.Infrastructure;
using PoLibrary.Services;
using Umbraco.Core.Models;

namespace ImperiumStroy
{
    public class Global:UmbracoApplication
    {
        protected override void OnApplicationStarted(object sender, EventArgs e)
        {
            base.OnApplicationStarted(sender, e); // На всякий случай, вдруг там что-то важное :)

            // Dependency Injection
            NinjectModule registrations = new NinjectReristrations();
            IKernel ninjectKernel = new StandardKernel(registrations);
            DependencyResolver.SetResolver(new NinjectDependencyResolver(ninjectKernel));
        }
    }

    public class NinjectReristrations : NinjectModule
    {
        public override void Load()
        {
            // Mail service
            Bind<IEmailService>().To<UmbracoEmailService>();
            Bind<INotificationEmailRepository>().To<UmbracoNotificationEmailRepository>();           
            Bind<ISmtpProvider>().To<DefaultSmtpProvider>();
            Bind<IViewService>().To<RazorViewService>();
        }
    }
}