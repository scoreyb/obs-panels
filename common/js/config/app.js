function clone(obj) {
    return jQuery.extend(true, {}, obj);
}

var view;

var panel = {
    id: -1,
    display: false,
    layout: {
        width: 'auto', // auto|Xpx|wide
    },
    margins: {
        top: null,
        right: 5,
        bottom: 5,
        left: 5,
    },
    position: 'bottom-left',
    style: {
        background: '#000000',
        border: {
            colour: '#00FF00',
            weight: 0,
        },
        padding: 10
    },
    content: {
        logo: {
            display: true,
            source: '/home/benedict/Desktop/obs-lower thirds/logos/logo_1.png',
        },
        divider: {
            display: true,
            background: '#FF0000',
        },
        title: {
            display: true,
            text: 'title',
            colour: '#222222',
            size: 50,
        },
        subtitle: {
            display: true,
            text: 'subtitle',
            colour: '#ffffff',
            size: 24,
        },
    }
};

var panelCount = 0;
var panels = {};

function update(panel) {
    view.send({
        type: 'panel',
        body: panel,
    });
}

function _each(object, callback) {
    var key;
    for (key in object) {
        if (! object.hasOwnProperty(key)) {
            continue;
        }
        callback(key, object[key]);
    }
}

function redrawPanelList() {
    var html;
    var checked;
    var element;
    var list = [];

    _each(panels, function (id, panel) {
        checked = panel.display ? 'checked="checked"' : '';
        widthSelected = 'selected="selected"';
        html = '' +
        '<div class="card panel" data-id="' + id + '">' +
        '    <div class="card-body">' +
        '        <label class="switch btn btn-sm"><input type="checkbox" class="displayPanelSwitch" ' + checked + ' /><span>Show</span></label>' +
        '        <button class="btn btn-link btn-sm displayTitle" type="button" data-bs-toggle="collapse" data-bs-target=".collapse-' + id + '" aria-expanded="false" aria-controls="collapseExample">' +
                    panel.content.title.text +
        '        </button>' +
        '        <div class="collapse collapse-' + id + '">' +
        '            <div class="clearfix" style="height: 15px;"></div>' + 
        '            <div class="input-group input-group-sm">' +
        '                <input class="form-control title" value="' + panel.content.title.text + '" placeholder="Title"/>' +
        '                <input type="number" class="form-control input-short titleSize" min="1" step="1" value="' + panel.content.title.size + '" placeholder="Size"/>' +
        '                <input type="text" class="colour titleColour" value="' + panel.content.title.colour + '" title="Title colour" />' +
        '            </div>' +
        '            <div class="input-group input-group-sm">' +
        '                <input type="text" class="subtitle form-control" value="' + panel.content.subtitle.text + '" placeholder="Subtitle"/>' +
        '                <input type="number" class="form-control input-short subtitleSize" min="1" step="1" value="' + panel.content.subtitle.size + '" placeholder="Size"/>' +
        '                <input type="text" class="colour subtitleColour" value="' + panel.content.subtitle.colour + '" title="Subtitle colour" />' +
        '            </div>' +
        '            <div class="input-group input-group-sm">' +
        '                <select class="layoutWidth" title="Layout">' +
        '                    <option value="auto" ' + (panel.layout.width === 'auto' ? widthSelected : '') + '>Auto</option>' +
        '                    <option value="wide" ' + (panel.layout.width === 'wide' ? widthSelected : '') + '>Wide</option>' +
        '                </select>' +

        '                <input type="number" min="-1" step="1" class="form-control margin" data-place="top" value="' + panel.margins.top + '" title="Margin top" />' +
        '                <input type="number" min="-1" step="1" class="form-control margin" data-place="right" value="' + panel.margins.right + '" title="Margin right" />' +
        '                <input type="number" min="-1" step="1" class="form-control margin" data-place="bottom" value="' + panel.margins.bottom + '" title="Margin bottom" />' +
        '                <input type="number" min="-1" step="1" class="form-control margin" data-place="left" value="' + panel.margins.left + '" title="Margin left" />' +

        '                <input type="text" class="colour backgroundColour" value="' + panel.style.background + '" title="Background colour" />' +
        '                <input type="text" class="colour dividerColour" value="' + panel.content.divider.background + '" title="Divider colour" />' +
        '            </div>' +
        '        </div>' +
        '    </div>' +
        '</div>';

        element = jQuery(html);

        initialisePanel(element);
        setPanelHandlers(element);

        list.push(element);
    });

    jQuery('.panels').empty().append(list);
}

function savePanels() {
    localStorage.setItem('panels', JSON.stringify(panels));
    localStorage.setItem('panelCount', panelCount);
}

function clearConfig() {
    localStorage.removeItem('panels');
    localStorage.removeItem('panelCount');
    window.location.reload();
}

/**
 * Reload the view window via a broadcast message
 */
function reloadViewWindow() {
    view.send({
        type: 'command',
        body: 'RELOAD',
    });
}

/**
 * Show all received messages in the view window. To switch off, reload
 */
 function debug() {
    view.send({
        type: 'command',
        body: 'DEBUG_ON',
    });
}

function addPanel() {
    var p = clone(panel);
    p.id = panelCount++;
    p.content.title.text = Math.floor(Math.random() * 1000);
    p.style.background = '#' + Math.floor(Math.random()*16777215).toString(16);
    p.margins.left = 50;
    p.margins.bottom = 50;
    p.margins.right = 0;
    p.content.logo.display = false;
    p.layout.width = Math.random() > 0.5 ? 'wide' : 'auto';

    panels[p.id] = p;

    savePanels();
}

function handleMessage(message) {
    switch (message.severity) {
        case 'error':
            console.warn('Received error', message.messages);
        default:
            console.warn('Unknown message severity', message);
    }
}

function handleCommand(command) {
    switch (command) {
        case 'GET_PANELS':
            synchronisePanels();
            break;
        default:
            console.warn('Unknown command', command);
    }
}

function ingestBroadcastMessage(msg) {
    var content = msg.data;
    var type = content.type;
    var body = content.body;
    switch (type) {
        case 'pong':
            break;
        case 'message':
            handleMessage(body);
        case 'command':
            handleCommand(body);
    }
}

/**
 * send all panels to the view, either on init, or on request
 */
function synchronisePanels() {
    _each(panels, function (id, panel) {
        update(panel);
    });
}

function init() {
    view = new Panel.Broadcast(ingestBroadcastMessage);
    // clear any content from previous sessions
    view.send({
        type: 'command',
        body: 'CLEAR_PANELS',
    });

    // add event listeners
    jQuery('.addPanel').on('click', function () {
        addPanel();
        redrawPanelList();
    });

    // load config
    panels = localStorage.getItem('panels');
    panelCount = localStorage.getItem('panelCount') || 0;
    if (panels) {
        try {
            panels = JSON.parse(panels);
        } catch (e) {
            console.warn("Invalid panels", panels);
            // invalid config, recover
            panels = {};
            savePanels();
        }
    } else {
        panels = {};
    }

    // draw panels
    redrawPanelList();

    synchronisePanels();
}

jQuery(window).ready(init);