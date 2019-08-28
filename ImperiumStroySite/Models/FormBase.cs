using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace ImperiumStroy.Models
{
    public abstract class FormBase
    {
        public string Url { get; set; }
        public string Type { get; set; }
    }
}