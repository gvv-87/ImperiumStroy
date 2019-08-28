using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;
using PoLibrary.Infrastructure;

namespace PoLibrary.Services
{  
    public class UmbracoEmailService : IEmailService
    {
        readonly ISmtpProvider _smtpProvider;
        readonly INotificationEmailRepository _notificationEmailRepository;

        public UmbracoEmailService(ISmtpProvider smtpProvider, INotificationEmailRepository notificationEmailRepository)
        {
            _smtpProvider = smtpProvider;
            _notificationEmailRepository = notificationEmailRepository;
        }
       
        // Отправить сообщение
        public void Send(MailMessage message)
        {
            using (SmtpClient smtp = _smtpProvider.GetSmtpClient())
            {
                message.To.Add(String.Join(",", _notificationEmailRepository.Emails));                
                smtp.Send(message); // Отправляем сообщение по почте
            }          
        }
    }
}
