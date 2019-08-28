// Список контейнеров
let containers = [
    // {
    //     root: '.main-page .contacts-block',
    //     items: [
    //         {
    //              selector: '.some-selector',
    //              anim: 'personalItemAnim'
    //         }
    //     ],
    //     setAnim: 'fadeInLeft',
    //     addDelay: true,
    //     startDelay: 0,
    //     delayStep: 0,
    //     topBlock: true, // Если блок находится вверху то лучше пометить
    //     bottomBlock: true // Если блок находится внизу страницы лучше его пометить
    // },
    {
        root: '.about-growth .about-growth__diagram'
    },
],settings = {
    defaultDelayStep: 2, // Шаг задержки
    defaultScreenDepth: 30 // На сколько процентов должен зайти дисплей на блок
};

$(function(){
    let $wnd = $(window),
        wh = $wnd.height(),
        dh = $(document).height() - 10,// Чтобы погрешности убрать;
        screenDepth = wh/100 * settings.defaultScreenDepth, // Кол-во пикселей, на которые должен зайти блок во вьюпорт
        unrendered = [],
        render = function(){
            let st = $wnd.scrollTop(),
                sb = st + wh,
                onBottom = sb > dh,
                onTop = st - 10 < 0,
                trigPointTop = st + wh - screenDepth,
                trigPointBot = st + screenDepth,
                $par,inViewport,ot,ob;

            for(let i = 0; i < containers.length; i++){
                inViewport = false;

                if(!containers[i].rootObj){
                    let $rootObj = $(containers[i].root);

                    if($rootObj.length === 0)
                        continue;
                    else
                        unrendered.push(i);

                    containers[i].rootObj = $rootObj.addClass('anim-parent');
                    containers[i].itemSelectors = [];

                    if(containers[i].items !== undefined){
                        for(let j = 0; j < containers[i].items.length; j++){
                            let $items = $rootObj.find(containers[i].items[j].selector),
                                itemStartDelay = containers[i].startDelay | 0,
                                itemDelayStep = containers[i].delayStep | settings.defaultDelayStep,
                                itemDelay = (containers[i].addDelay ? ' delay-' + (itemDelayStep*j + itemStartDelay) : ''),
                                itemAnim = containers[i].items[j].anim ? ' ' + containers[i].items[j].anim : (containers[i].setAnim ? ' ' + containers[i].setAnim : '');

                            $items.addClass('anim-item' + itemAnim + itemDelay);

                            containers[i].itemSelectors.push(containers[i].items[j].selector);
                        }
                    }
                }

                $par = containers[i].rootObj;
                ot = $par.offset().top;
                ob = ot + $par.height();
                inViewport = !(ot > trigPointTop || ob < trigPointBot);

                if(inViewport || (containers[i].bottomBlock && onBottom) || (containers[i].topBlock && onTop)){
                    $par.addClass('in-viewport');

                    if(containers[i].itemSelectors.length > 0){
                        try{
                            $par.find(containers[i].itemSelectors.join(','))
                                .addClass('animated');
                        }catch(err){
                            console.log('Error in viewport-animation module: ' + err.message);
                        }
                    }

                    let iof = unrendered.indexOf(i);
                    if(iof >= 0){
                        unrendered.splice(iof,1);
                    }
                }
            }

        };

    $wnd.scroll(function(e){
        if(unrendered.length === 0){
            $wnd.off(e);
            return;
        }

        render();
    });

    render();
});