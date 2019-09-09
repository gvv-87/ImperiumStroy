using System.Linq;
using System.Text.RegularExpressions;
using System.Web;

namespace System
{
    /// <summary>
    /// Возвращает строку из цифр без пробелов номера телефона
    /// </summary>
    public static class StringExtensions
    {
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

        /// <summary>
        /// Заменить входные разрывы строк на <br/> и ковертировать строки в IHtmlString
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public static IHtmlString ReplaceLineBreaks(this string input)
        {
            return new HtmlString(Regex.Replace(input, @"(\r\n)|\n|\r", "<br/>"));
        }
    }
}
