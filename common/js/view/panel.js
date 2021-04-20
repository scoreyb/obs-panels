var Panel = Panel || {};
Panel.panel = (function () {
    var zIndex = 0;

    var blankPanel = '' +
        '<div class="panel animate">' +
        '    <div class="icon"><img/></div>' +
        '    <div class="divider"></div>' +
        '    <div class="text">' +
        '        <div class="title"></div>' +
        '        <div class="subtitle"></div>' + //<marquee scrollamount="1" class="subtitle"></marquee>
        '    </div>' +
        '</div>';


    var insert = function (panel) {
        var content = jQuery(blankPanel);
        content.attr('id', panel.id);

        jQuery('.container').append(content);
    };

    var update = function (panel) {
        var width;
        var widthClass;
        switch (panel.layout.width) {
            case 'auto':
                width = 'fit-content';
                widthClass = 'fit-content';
                break;
            case 'wide':
                var spacing = panel.margins.left + panel.margins.right + panel.style.padding * 2;
                widthClass = 'fixed';
                width = 'calc(100% - ' + spacing + 'px)';
                break;
            default:
                widthClass = 'fixed';
                width = panel.layout.width;
        }

        var el = $('.container .panel#' + panel.id);

        el
            .css({
                top: (panel.margins.top === null ? '' : panel.margins.top + 'px'),
                right: (panel.margins.right === null ? '' : panel.margins.right + 'px'),
                bottom: (panel.margins.bottom === null ? '' : panel.margins.bottom + 'px'),
                left: (panel.margins.left === null ? '' : panel.margins.left + 'px'),
                background: panel.style.background,
                border: panel.style.border.weight + 'px solid ' + panel.style.border.colour,
                padding: panel.style.padding + 'px',
                width: width,
            })
            .removeClass('bottom-left bottom-right top-left top-right')
            .addClass(panel.position)
            .removeClass('fit-content fixed')
            .addClass(widthClass);

        if (! panel.display && ! el.hasClass('hidden')) {
            /*el.removeClass('animate');
            setTimeout(function () {
                el.addClass('animate hidden');
            }, 1);*/
            el.fadeOut(500);
            setTimeout(function () {
                el.addClass('hidden');
            }, 600);
            return;
        } else if (panel.display && el.hasClass('hidden')) {
            /*el.removeClass('animate hidden');
            setTimeout(function () {
                el.addClass('animate');
            }, 1);*/
            el.fadeIn(500);
            el.removeClass('hidden');
        }

        // down here so that panels being hidden don't suddenly pop to the front before disappearing
        el.css({
            zIndex: zIndex++,
        })
        
        el.find('.icon img')
            .attr('src', panel.content.logo.source)
            .css({
                display: panel.content.logo.display ? 'block' : 'none',
            });
        
        el.find('.divider')
            .css({
                display: panel.content.divider.display ? 'block' : 'none',
                background: panel.content.divider.background,
            });

        el.find('.title')
            .text(panel.content.title.text)
            .css({
                display: panel.content.title.display ? 'block' : 'none',
                'font-size': panel.content.title.size + 'px',
                color: panel.content.title.colour,
            });

        el.find('.subtitle')
            .text(panel.content.subtitle.text)
            .css({
                display: panel.content.subtitle.display ? 'block' : 'none',
                'font-size': panel.content.subtitle.size + 'px',
                color: panel.content.subtitle.colour,
            })
    };

    return {
        insert: insert,
        update: update,
    }
})();