using System;
using System.Linq;
using System.Web;
using Umbraco.Web.Mvc;
using Umbraco.Web.PublishedContentModels;

namespace PoLibrary
{
    public class ExtendedUmbracoViewPage<TModel> : UmbracoViewPage<TModel>
    {
        IScriptsSettings _scriptsSettings;
        TagAddition _headAddition;
        TagAddition _bodyAddition;

        // Свойство дающее дополнительные Head и Body скрипты
        public PageAdditionalScripts Scripts {
            get
            {
                if(_scriptsSettings == null)
                {
                    _scriptsSettings = Umbraco.TypedContentAtRoot().FirstOrDefault(node => node is IScriptsSettings) as IScriptsSettings;
                }
                              
                if (_headAddition == null || _bodyAddition == null)
                {
                    // Все нормально, никакой ошибки :)
                    if(_scriptsSettings != null)
                    {
                        _headAddition = new TagAddition(before: _scriptsSettings.HeadAfterOpening, after: _scriptsSettings.HeadBeforeClosing);
                        _bodyAddition = new TagAddition(before: _scriptsSettings.BodyAfterOpening, after: _scriptsSettings.BodyBeforeClosing);
                    }
                    else
                    {
                        string errorMessage = "<!-- No scripts settings founded. Add it to the site-tree -->";
                        _headAddition = new TagAddition(before: errorMessage, after: errorMessage);
                        _bodyAddition = new TagAddition(before: errorMessage, after: errorMessage);
                    }                  
                }

                return new PageAdditionalScripts(_headAddition, _bodyAddition);
            }
        }

        // Понятия не имею что это делает, но требуется реализация :)
        public override void Execute()
        {
            throw new NotImplementedException();
        }

        #region Вложенные классы

        // Добавочный скрипт
        public class TagAddition
        {
            public TagAddition(string before = null, string after = null)
            {
                Before = new HtmlString(before);
                After = new HtmlString(after);
            }

            public IHtmlString Before { get; }
            public IHtmlString After { get; }
        }

        // Добавочные скрипты 
        public class PageAdditionalScripts
        {
            public PageAdditionalScripts(TagAddition head = null, TagAddition body = null)
            {
                Body = body;
                Head = head;
            }

            public TagAddition Body { get; set; }
            public TagAddition Head { get; set; }
        }

        #endregion
    }
}
