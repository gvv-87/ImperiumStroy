﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace ImperiumStroy.Models
{
    public class Feedback:FormBase
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Message { get; set; }
        public string Agree { get; set; }
    }
}