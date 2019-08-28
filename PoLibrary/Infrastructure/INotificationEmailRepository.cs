using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;

namespace PoLibrary.Infrastructure
{
    public interface INotificationEmailRepository
    {
        IEnumerable<MailAddress> Emails { get; }
    }
}
