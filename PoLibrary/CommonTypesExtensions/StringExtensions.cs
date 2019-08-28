using System.Linq;
using System.Text.RegularExpressions;
using System.Web;

namespace System
{
    public static class StringExtensions
    {
        // Превратить строку в отформатированный (без пробелов) телефон
        public static string ToPhone(this string input)
        {
            var digits = new String(input.Where(Char.IsDigit).ToArray()); // Оставляем только цифры

            // Начинается с плюса?
            if (input.StartsWith("+"))
            {
                digits = "+" + digits;
            }

            return digits;
        }

        // Replaces input linebreaks with <br/> and convert it to IHtmlString
        public static IHtmlString ReplaceLineBreaks(this string input)
        {
            return new HtmlString(Regex.Replace(input, @"(\r\n)|\n|\r", "<br/>"));
        }
    }
}
