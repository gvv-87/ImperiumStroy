using PoLibrary.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;
using Umbraco.Core.Configuration;

namespace PoLibrary.Services
{
    public class UmbracoNotificationEmailRepository : INotificationEmailRepository
    {
        public UmbracoNotificationEmailRepository()
        {
            string emailsAsString = UmbracoConfig.For.UmbracoSettings().Content.NotificationEmailAddress;

            Emails = from email in emailsAsString.Split(',')
                     select new MailAddress(email);                     
        }

        public IEnumerable<MailAddress> Emails { get; }
    }
}
