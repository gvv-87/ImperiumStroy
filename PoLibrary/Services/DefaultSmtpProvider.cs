using PoLibrary.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;

namespace PoLibrary.Services
{
    public class DefaultSmtpProvider : ISmtpProvider
    {
        public SmtpClient GetSmtpClient()
        {
            return new SmtpClient(); // Стандартный клиент, сконфигурированный данными из Web.config
        }
    }
}
