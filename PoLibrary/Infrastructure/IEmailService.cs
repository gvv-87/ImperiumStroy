﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Net.Mail;

namespace PoLibrary.Infrastructure
{
    public interface IEmailService
    {
        void Send(MailMessage message);
    }
}
