// Константы
const BIG_WIDTH = 1199;
const MEDIUM_WIDTH = 639;
const SMALL_WIDTH = 320;

// Убери лишние 2 слеша чтобы подключить модуль
////=require components/insertRule.js
////=require components/double_tap.js
/**
 * Модальное окно
 * Показать: $(modal_selector).modal('show');
 * Скрыть: $(modal_selector).modal('hide');
 * Забиндить по нажатию на ссылку по href: $(link_selector).modal('bindHref');
 * Забиндить по нажатию на ссылку по data: $(link_selector).modal('bindData');
 */

(function ($) {
    const MODAL_POSITION_INNER = 'inner';
    const MODAL_POSITION_OUTER = 'outer';

    var modal_defaults = {
        closePos: MODAL_POSITION_INNER,         // Позиция кнопки закрытия. Может быть внутри или снаружи самого окна
        scrollBackground: true,                 // Флаг прокрутки контента за модалкой
        initOnInclude: true                     // Активировать все модалки при подключении модуля (рекомендуется для нормального отображения слика).
    };

    var methods = {
        bindHref: function () {
            this.on('click', function (e) {
                $($(this).attr('href')).modal('show');
                e.preventDefault();
            });
        },
        bindData: function () {
            this.on('click', function (e) {
                $($(this).data('modal')).modal('show');
                e.preventDefault();
            });
        },
        init: function (modal) {
            var $modalTemplate = $('<div class="modal modal-initialized"><div class="modal-container"><div class="modal-overlay"></div></div></div></div>');
            $modalTemplate.find('.modal-container').append(modal.detach());

            var $buttonClose = $('<button class="modal-close" type="button"></button>');
            if (modal_defaults.closePos === MODAL_POSITION_INNER)
                modal.prepend($buttonClose);
            else
                modal.parent().prepend($buttonClose);

            var id = modal.attr('id');
            modal.attr('id', '');
            $modalTemplate.attr('id', id);
            $('body').append($modalTemplate);

            modal = $modalTemplate.fadeIn();

            // Если в модалке слик то его при инициализации нужно переинициализировать,
            // иначе он либо не отработает либо отработает криво.
            // var sld = modal.find('.slick-slider');
            //
            // if(sld.length){
            //     sld.slick('reinit');
            //      /*setTimeout(function(e){
            //      sld.slick('slickGoTo', 0)
            //      }, 10);*/
            // }
        },
        show: function (modal) {
            // Ежели нам не дали в функцию модалку - пускай это будет текущий элемент
            if (modal == undefined)
                modal = this;

            // Проверим инициализацию модалки и если не инициализирована - создадим темплейт
            if (!modal.hasClass('modal-initialized')) {
                methods.init(modal);
            }

            // Делаем модалку видимой
            modal.addClass('visible');
            // Ищем кнопку закрытия модалки и подложку и вешаем на них событие закрытия модалки
            modal.find('.modal-close, .modal-overlay, .modal-closeme').click(function (event) {
                modal.modal('hide');
                //event.preventDefault();
            });

            // Если высота окна меньше чем высота модалки то запрещаем скроллить html (модалка скроллится)
            if (!modal_defaults.scrollBackground || $(window).height() < modal.find('.modal-container').get(0).clientHeight) {
                $('html').addClass('modal-overflow');
            }

            var sld = modal.find('.slick-slider');
            if (sld.length) sld.slick('reinit');
        },
        hide: function (modal) {
            if (modal == undefined)
                modal = this;

            if (!modal.hasClass('modal-initialized')) return;

            var ifr = modal.find('iframe');
            if (ifr.length) {
                ifr.parent().append(ifr.detach());
            }

            var vid = modal.find('video');
            if (vid.length) {
                vid.get(0).pause();
            }

            // Скрываем модалку
            modal.removeClass('visible');
            // Выключаем слушатели событий нажатия с кнопок и подложки
            modal.find('.modal-close, .modal-overlay').off();
            // Возвращаем возможность скроллинга html
            $('html').removeClass('modal-overflow');
        },
        getScrollbarWidth: function () {
            var documentWidth = parseInt(document.documentElement.clientWidth);
            var windowsWidth = parseInt(window.innerWidth);
            return windowsWidth - documentWidth;
        },
        setOption: function (opt) {
            modal_defaults = $.extend(JSON.parse(JSON.stringify(modal_defaults)), opt);
        }
    };

    $.fn.modal = function (method) {
        // логика вызова метода
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else {
            $.error('Метод с именем ' + method + ' не существует для jQuery.modal');
        }
    };

    // При загрузке страницы заинициализируем все модалки
    if (modal_defaults.initOnInclude) {
        $('.modal-content').each(function (i, v) {
            var $me = $(v);
            if ($me.parents('.modal').length == 0) {
                $me.modal('init', $me);
            }
        });
    }
})(jQuery);
/**
 * Модуль аккордиона
 */

(function ($) {
    var accordion_defaults = {
        selfClose: true,                    // Позволять закрыть текущий элемент (нужно сочитать с multiple)
        multiple: true,                     // Если false то нельзя развернуть больше 1 аккордиона
        offFrom: 0,                         // Выключать аккордион начиная с этого размера экрана
        offset: 20,                         // Отступ от текущего выбранного элемента до верха экрана (при развороте)
        animSpeed: 300,                     // Скорость анимации открытия
        animEasingFunction: 'swing',       // Функция анимации
        offScrollFrom: 720,                 // Выключить прокрутку, начиная с этого размера экрана (0 - не скроллить вообще)
        rollUpChilds: false,                // Сворачивать ли детей при свертывании родителя
        doubleClickTo: 0                    // До какого размера экрана отменяем первый клик на хедере (нужно для адаптивности) 0 - не отменяем
    };

    var accordion_methods = {
        'rollDown': function(){
            var $item = $(this);
            var opt = $item.data('accordion-options')||{};

            $item.children('.accordion-content').slideDown({
                duration: opt.animSpeed || accordion_defaults.animSpeed,
                easing: opt.animEasingFunction || accordion_defaults.animEasingFunction
            });
            $item.addClass('expanded');
            $item.trigger('expanded');
        },
        'rollUp': function(){
            var $item = $(this);
            var opt = $item.data('accordion-options')||{};

            $item.children('.accordion-content').slideUp({
                duration: opt.animSpeed || accordion_defaults.animSpeed,
                easing: opt.animEasingFunction || accordion_defaults.animEasingFunction
            });
            $item.removeClass('expanded');
            $item.trigger('collapsed');
        }
    };

    $.fn.accordion = function () {
        var options = accordion_defaults;

        // логика вызова метода
        if(arguments.length > 0){
            if(typeof arguments[0] === "string"){
                if (accordion_methods[arguments[0]]) {
                    return accordion_methods[arguments[0]].apply(this, arguments);
                } else {
                    $.error('Метод с именем ' + arguments[0] + ' не существует для jQuery.accordion');
                    return;
                }
            }else if(typeof arguments[0] === "object"){
                options = $.extend(JSON.parse(JSON.stringify(accordion_defaults)),arguments[0]);
            }
        }

        var ww = $(window).width();
        this.addClass('accordion-root');
        this.data('accordion-options',options);

        if (options.doubleClickTo >= ww && $.event.special.doubletap != undefined){
            this.children('.accordion-header').children('a').on('dblclick doubletap', function(e){
                window.location = $(this).attr('href');
            }).on('click',function(e){
                e.preventDefault();
            });
        }

        this.children('.accordion-header').on('click', function (e) {
            if (options.offFrom > 0 && ww > options.offFrom) {
                e.preventDefault();
                return;
            }

            var $me = $(this).parent();

            if (!options.multiple) {
                var $prev = $me.siblings('.expanded');

                if ($prev.get(0) != $me.get(0)) {
                    $prev.children('.accordion-content').slideUp({
                        duration: options.animSpeed,
                        easing: options.animEasingFunction
                    });
                    $prev.removeClass('expanded');
                }
            }

            if (options.selfClose || (!options.selfClose && !$me.hasClass('expanded'))) {
                $me.children('.accordion-content').slideToggle({
                    duration: options.animSpeed,
                    easing: options.animEasingFunction
                });
                var has = $me.toggleClass('expanded').hasClass('expanded');

                if (has && options.offScrollFrom > ww) {
                    $('body').animate(
                        {
                            scrollTop: $me.offset().top - options.offset
                        }, 700
                    );
                }

                if(has){
                    $me.trigger('expanded');
                }else{
                    $me.trigger('collapsed');
                }

                if(!has && options.rollUpChilds){
                    $me.find('.accordion-root.expanded').removeClass('expanded').children('.accordion-content').slideUp(1);
                }
            }

            //e.preventDefault();
        });

        return this;
    }
})(jQuery);
////=require components/tabs.js
////=require components/parallax.js
////=require components/select.js
////=require components/anim.js
/**
 * Модуль плавающего хедера с функцией "показать/скрыть" при прокрутке
 */

(function ($) {
    var lst = 0;
    var defaults = {
        offset: 60, // Расстояние от верха страницы до хедера, с которого отключается фиксация.
        offFrom: 0 // Выключать фиксацию хедера начиная (исключая) с этого значения. 0 - не выключать (MobileFirst)
    };

    $.fn.floatHeader = function(opt){
        var options = $.extend(JSON.parse(JSON.stringify(defaults)), opt),
            $hdr = this,
            offset = $hdr.height() + options.offset,
            $win = $(window),
            ww = $win.width(),

            floatHeaderInit = function(){
                if(options.offFrom > 0 && ww <= options.offFrom || options.offFrom == 0){
                    var st = $win.scrollTop();
                    var delta = lst - st;

                    if (st > offset) {
                        $hdr.addClass('fix');
                    } else if(st == 0){
                        $hdr.removeClass('fix up down');
                    }

                    if ($hdr.hasClass('fix') && st > offset) {
                        if (delta > 0) {
                            $hdr.removeClass('down').addClass('up');

                            if ($(this).scrollTop() < offset) {
                                $hdr.removeClass('up').addClass('down');
                            }
                        } else if (delta < 0 && $hdr.hasClass('up')) {
                            $hdr.removeClass('up').addClass('down');
                        }
                    }

                    lst = st;
                }
            };

        floatHeaderInit();
        $(window).scroll(function(e){
            floatHeaderInit();
        });

        return this;
    }
})(jQuery);
////=require components/tooltip.js
////=require components/inputFile.js

var ww = $(window).width(),
    wh = window.innerHeight ? window.innerHeight : $(window).height(),
    $body = $('body'),
    $pageWrap = $body.find('.page-wrap'),
    util = {
        isTouch: function () {
            var prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
            var mq = function (query) {
                return window.matchMedia(query).matches;
            };

            if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
                return true;
            }

            // include the 'heartz' as a way to have a non matching MQ to help terminate the join
            // https://git.io/vznFH
            var query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');
            return mq(query);
        },
        isIe: function () {
            return navigator.userAgent.match(/Trident\/7.0/i);
        },
        isSafari: function () {
            return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        },
        refreshCustomVH: function () {
            let vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        },
        getScrollbarWidth: function () {
            let documentWidth = parseInt(document.documentElement.clientWidth),
                windowsWidth = parseInt(window.innerWidth);

            return windowsWidth - documentWidth;
        },
    },
    app = {
        initSlick: function () {
            // Slick section
            if ($.fn.slick != undefined) {
                var sliders = {
                    mainTabsBlockImages: {
                        infinite: true,
                        fade: true,
                        dots: false,
                        arrows: false,
                        asNavFor: '#mainTabsBlockText'
                    },
                    mainTabsBlockText: {
                        infinite: true,
                        fade: true,
                        dots: true,
                        arrows: false,
                        asNavFor: '#mainTabsBlockImages',
                        adaptiveHeight: true
                    },
                    projectsMainImages: {
                        infinite: true,
                        fade: true,
                        dots: false,
                        arrows: true,
                        asNavFor: '#projectsMainText'
                    },
                    projectsMainText: {
                        infinite: true,
                        fade: true,
                        dots: false,
                        arrows: false,
                        asNavFor: '#projectsMainImages',
                        adaptiveHeight: false,
                        autoplay: true,
                        autoplaySpeed: 10000,
                        pauseOnHover: false
                    },
                    testimonialsSlider:{
                        infinite: true,
                        adaptiveHeight: false,
                        dots: false,
                        arrows: true,
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        mobileFirst: true,
                        variableWidth: true,
                        responsive: [
                            {
                                breakpoint: MEDIUM_WIDTH,
                                settings: {
                                    slidesToShow: 2
                                }
                            },
                            {
                                breakpoint: 1600,
                                settings: {
                                    slidesToShow: 3
                                }
                            }
                        ]
                    },
                    employeesSlider:{
                        infinite: true,
                        arrows: true,
                        dots: true,
                        centerMode: true,
                        centerPadding: '0',
                        mobileFirst: true,
                        slidesToScroll: 1,
                        slidesToShow: 1,
                        adaptiveHeight: false,
                        responsive: [
                            {
                                breakpoint: MEDIUM_WIDTH,
                                settings: {
                                    slidesToShow: 3
                                }
                            },
                            {
                                breakpoint: BIG_WIDTH,
                                settings: {
                                    slidesToShow: 5
                                }
                            }
                        ]
                    },
                    projectItemSlider: {
                        infinite: true,
                        fade: true,
                        dots: false,
                        arrows: true
                    },
                    otherProjectsSlider: {
                        infinite: false,
                        dots: false,
                        arrows: true,
                        variableWidth: true,
                        adaptiveHeight: false,
                        mobileFirst: true,
                        responsive: [
                            {
                                breakpoint: 900,
                                settings: {
                                    slidesToShow: 2
                                }
                            },
                            {
                                breakpoint: 1300,
                                settings: {
                                    slidesToShow: 3
                                }
                            }
                        ]
                    },
                    calcModalSlider: {
                        infinite: false,
                        draggable: false,
                        swipe: false,
                        slidesToShow: 1,
                        fade: true,
                        slidesToScroll: 1,
                        arrows: false,
                        dots: false,
                        onInit: function(e, slick){
                            let $nextSlideBtn = $('#calcModalNextSlide'),
                                $prevSlideBtn = $('#calcModalPrevSlide'),
                                $submitFormBtn = $('#calcModalSend'),
                                $sld = $(this),
                                $counter = $('<span>'+(slick.currentSlide + 1)+'</span>'),
                                stepText = $sld.data('step-text'),
                                fromText = $sld.data('step-from'),
                                sldCount = slick.slideCount,

                                $circleDiagram = $('<div class="circle-diagram"><span></span><span></span></div>'),
                                $diagramSemisphere = $circleDiagram.find('span').eq(0),

                                $progress = $('<span class="calc-modal__slider_progress"></span>'),
                                calcProgress = function(curr){
                                    let val = Math.floor(curr/sldCount * 100),
                                        deg = curr/sldCount * 360;

                                    $progress.text(val);
                                    $diagramSemisphere.css({
                                        transform: 'translateZ(0) rotate(' + deg + 'deg)'
                                    });

                                    if(deg > 180){
                                        $circleDiagram.addClass('half');
                                    }else{
                                        $circleDiagram.removeClass('half');
                                    }
                                };

                            $sld.append(
                                $('<span class="calc-modal__slider_currcount">'+stepText+' </span>').append($counter),
                                $('<span class="calc-modal__slider_fromcount">'+fromText+' '+slick.slideCount+'</span>'),
                                $circleDiagram,
                                $progress
                            );

                            calcProgress(1);

                            $sld.on('beforeChange', function(e, slick, prev, next){
                                if(next !== 0){
                                    $prevSlideBtn.removeClass('hidden').prop('disabled', false);
                                }else{
                                    $prevSlideBtn.addClass('hidden').prop('disabled', true);
                                }

                                if(next === slick.slideCount - 1){
                                    $nextSlideBtn.addClass('hidden').prop('disabled', true);
                                    $submitFormBtn.removeClass('hidden');
                                }else{
                                    $nextSlideBtn.removeClass('hidden').prop('disabled', false);
                                    $submitFormBtn.addClass('hidden');
                                }

                                $counter.text(next + 1);
                                calcProgress(next + 1);
                            });

                            $nextSlideBtn.click(function(e){
                                slick.slickNext();

                                e.preventDefault();
                            });

                            $prevSlideBtn.click(function(e){
                                slick.slickPrev();

                                e.preventDefault();
                            });
                        }
                    }
                };

                $('[data-slick]').each(function (i, v) {
                    var $sld = $(v),
                        sett = sliders[$sld.data('slick')];

                    // Для добавления в слайдер счётчика слайдов.
                    if ($sld.hasClass('slick-countered')) {
                        $sld.on('init', function (e, slick) {
                            $(this).append('<span class="slick-counter">' + ((slick.currentSlide + 1) + ' / ' + slick.$slides.length) + '</span>');
                        }).on('beforeChange', function (e, slick, curr, next) {
                            $(this).find('.slick-counter').html((next + 1) + ' / ' + (slick.$slides.length));
                        });
                    }

                    // Для добавления в слайдер "табов"
                    if ($sld.hasClass('slick-tabbed')) {
                        $sld.on('init', function (e, slick) {
                            slick.$slides.each(function (i, v) {
                                slick.$dots.find('button').eq(i).text($(v).data('slick-tab'));
                            });
                        });
                    }

                    if (sett !== undefined) {
                        if(sett.onInit !== undefined){
                            $sld.on('init', sett.onInit);
                        }

                        $sld.slick(sett);
                    }
                });
            }
        },

        initRellax: function () {
            if (Rellax) {
                var rellax = new Rellax('.rellax-item');

                if (ww > BIG_WIDTH) {
                    var rellaxBig = new Rellax('.rellax-bigonly');
                }
            }
        },

        initOthers: function () {
            $('#menuBurger,#menuClose').click(function (e) {
                var has = $('#pageHeader').toggleClass('expanded').hasClass('expanded');

                if(has)
                    $('body').addClass('modal-overflow');
                else
                    $('body').removeClass('modal-overflow');

                e.preventDefault();
            });

            $('.page-header').floatHeader({offset: 100});

            $('.switcher').click(function(e){
                $(this).toggleClass('switched');
            });

            // Кастомный vh
            util.refreshCustomVH();
            window.addEventListener('resize', () => {
                // We execute the same script as before
                util.refreshCustomVH();
            });

            document.documentElement.style.setProperty('--scrollbarWidth', util.getScrollbarWidth() + 'px');
        },

        initTextTyping: function () {
            var $switchingTextItems = $('.switching-text'),
                objs = [],
                intervalTicks = 5,// Количество тиков между шагами
                defaultInterval = 5000,
                startInterval = 5000,
                defaultTimeout = 30;

            $switchingTextItems.each(function (i, v) {
                var $cont = $(v),
                    wordList = $cont.data('text-switching');

                objs.push({
                    cont: $cont,
                    wlist: wordList,
                    currInd: 0,
                    step: 0,
                    currChars: wordList[0],
                    nextChars: '',
                    ticks: 0
                });
            });

            if (objs.length > 0) {
                var renderNext = function () {
                    for (var i = 0; i < objs.length; i++) {
                        var currObj = objs[i],
                            int = setInterval(function () {
                                switch (currObj.step) {
                                    case 0:
                                        currObj.currChars = currObj.currChars.substring(0, currObj.currChars.length - 1);

                                        currObj.cont.text(currObj.currChars);

                                        if (currObj.currChars.length == 0) {
                                            currObj.step = 1;
                                        }
                                        break;
                                    case 1:
                                        if (++currObj.ticks >= intervalTicks) {
                                            currObj.ticks = 0;
                                            currObj.step = 2;
                                        }
                                        break;
                                    case 2:
                                        if (currObj.nextChars.length == 0) {
                                            currObj.currInd = (currObj.wlist.length - 1 <= currObj.currInd) ? 0 : ++currObj.currInd;
                                            currObj.nextChars = currObj.wlist[currObj.currInd];
                                        }

                                        currObj.currChars += currObj.nextChars[0];
                                        currObj.nextChars = currObj.nextChars.substr(1, currObj.nextChars.length - 1);

                                        currObj.cont.text(currObj.currChars);

                                        if (currObj.nextChars.length == 0) {
                                            currObj.step = 3;
                                        }
                                        break;
                                    case 3:
                                        currObj.step = 0;
                                        clearInterval(int);

                                        if (currObj.currInd < currObj.wlist.length - 1) {
                                            setTimeout(renderNext, defaultInterval);
                                        }
                                        break;
                                }
                            }, defaultTimeout);
                    }
                };

                setTimeout(renderNext, startInterval);
            }
        },

        removeBodyPreload: function () {
            $body.removeClass('preload');
        },

        addBodyPrefixes: function () {
            var prefixes = [];
            if (util.isTouch()) prefixes.push('touch-device');
            if (util.isIe()) prefixes.push('is-ie');
            if (util.isSafari()) prefixes.push('is-safari');

            $body.addClass(prefixes.join(' '));
        },

        initMaskedInput: function(){
            if ($.fn.mask != undefined) $('input[type=tel]').mask('+7 (999) 999-99-99');
        },

        initPopups: function(){
            if($.fn.modal != undefined) $('[data-modal]').modal('bindData');
        },

        initAccordions: function(){
            if($.fn.accordion != undefined) $('.accordion').accordion();
        },

        // initFieldsCustomFocus: function(){
        //     var $inputs = $('input, textarea');
        //     $inputs.focus(function (e) {
        //         $(this).addClass('focused');
        //     }).blur(function (e) {
        //         if ($(this).val().length == 0) {
        //             $(this).removeClass('focused');
        //         }
        //     });
        //
        //     $inputs.each(function (i, v) {
        //         var $me = $(v);
        //         if ($me.val().length > 0) {
        //             $me.addClass('focused');
        //         }
        //     });
        // },

        initSmoothScroll: function(){
            $('.smooth-scroll').click(function(e){
                let $me = $(this),
                    $targ = $($me.attr('href')),
                    offset = 0;

                if($targ.length){
                    $('html, body').animate(
                        {
                            scrollTop: $targ.offset().top - offset
                        }, 1000
                    );
                }

                e.preventDefault();
            });
        }
    };


$(function () {
    try {
        app.initSlick();
        app.initRellax();
        app.initOthers();
        app.initAccordions();
        app.initMaskedInput();
        app.initSmoothScroll();
        app.initPopups();

        app.initTextTyping();

        app.addBodyPrefixes();

    } catch (e) {
        console.log('Обнаружена ошибка! ' + e.message);
    } finally {
        app.removeBodyPreload();
    }
});

function CommonForm($scope, $http, url, callback) {
    return function () {
        $scope.submitProcess = true;
        $http.post(url, $scope.model)
            .then(function (resp) {
                $scope.resp = resp.data;
                $scope.submitProcess = false;
                if (callback) {
                    callback();
                }
            });
    }
}