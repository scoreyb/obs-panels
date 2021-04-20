function getPanel(element) {
    var id = parseInt(jQuery(element).parents('.panel').attr('data-id'));
    return panels[id];
}

function initialisePanel(element) {
    element.find('input.colour').spectrum({
        showAlpha: true,
        showPalette: true,
        clickoutFiresChange: true,
        preferredFormat: "rgb",
        showInput: true,
    });
}

function setPanelHandlers(element) {
    // on view hide switch toggle
    element.find('.displayPanelSwitch').on('change', function () {
        var checkbox = jQuery(this);
        var panel = getPanel(this);
        var state = checkbox.is(':checked');
        panel.display = state;
        update(panel);
        savePanels();
    });

    // on title edit
    element.find('.title').on('keyup', function () {
        var panel = getPanel(this);
        panel.content.title.text = jQuery(this).val();
        jQuery(this).parents('.panel').find('.displayTitle').text(panel.content.title.text);
        update(panel);
        savePanels();
    });

    // on sub title edit
    element.find('.subtitle').on('keyup', function () {
        var panel = getPanel(this);
        panel.content.subtitle.text = jQuery(this).val();
        update(panel);
        savePanels();
    });

    // colours
    element.find('.backgroundColour').on('move.spectrum hide.spectrum', function (e, colour) {
        var panel = getPanel(this);
        panel.style.background = colour.toRgbString();
        update(panel);
        savePanels();
    });

    element.find('.dividerColour').on('move.spectrum hide.spectrum', function (e, colour) {
        var panel = getPanel(this);
        panel.content.divider.background = colour.toRgbString();
        update(panel);
        savePanels();
    });

    element.find('.titleColour').on('move.spectrum hide.spectrum', function (e, colour) {
        var panel = getPanel(this);
        panel.content.title.colour = colour.toRgbString();
        update(panel);
        savePanels();
    });

    element.find('.subtitleColour').on('move.spectrum hide.spectrum', function (e, colour) {
        var panel = getPanel(this);
        panel.content.subtitle.colour = colour.toRgbString();
        update(panel);
        savePanels();
    });

    // bar width
    element.find('.layoutWidth').on('change keyup', function (e, colour) {
        var panel = getPanel(this);
        panel.layout.width = jQuery(this).val();
        update(panel);
        savePanels();
    });

    // text size
    element.find('.titleSize').on('change keyup', function () {
        var panel = getPanel(this);
        panel.content.title.size = parseInt(jQuery(this).val());
        update(panel);
        savePanels();
    });

    element.find('.subtitleSize').on('change keyup', function () {
        var panel = getPanel(this);
        panel.content.subtitle.size = parseInt(jQuery(this).val());
        update(panel);
        savePanels();
    });

    // margins
    element.find('.margin').on('keyup', function () {
        var panel = getPanel(this);
        var margin = jQuery(this).attr('data-place');
        var val = parseInt(jQuery(this).val());
        // -1 px is used to represent null/inapplicable
        if (val < 0) {
            val = null;
        }
        panel.margins[margin] = val;
        update(panel);
        savePanels();
    });
}