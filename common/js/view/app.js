/** @var {Panel.Broadcast} instance of broadcast communication channel */
var view;

/** @var {object} Details of all panels sent to the view - i.e. with rendered elements */
var panels = {};

// show debug information in the view
var _debug = false;

function clearAllPanels() {
    jQuery('.container').empty();
    panels = {};
}

/**
 * Run a command from the config view
 * @param {String} command 
 */
function runCommand(command) {
    switch (command) {
        case 'CLEAR_PANELS':
            clearAllPanels();
            break;

        case 'RELOAD':
            window.location.reload();
            break;

        case 'DEBUG_ON':
            _debug = true;
            break;

        default:
            console.warn('Unknown command', command);
            view.send({
                type: 'message',
                body: {
                    severity: 'error',
                    messages: ['Unknown command', command],
                }
            });
    }
}

function init() {
    view = new Panel.Broadcast(function (msg) {
        if (_debug) {
            console.log('rx', msg.data);
            jQuery('.log').append(JSON.stringify(msg.data) + '<hr>');
        }

        view.send({
            type: 'pong',
        });

        var content = msg.data;
        var type = content.type;

        if (type === 'command') {
            runCommand(content.body);
        } else if (type === 'panel') {
            // we have received an inserted or changed panel. It has an ID for matching on
            var panel = content.body;

            var panelExists = panels.hasOwnProperty(panel.id);

            panels[panel.id] = panel;

            if (! panelExists) {
                Panel.panel.insert(panel);
            }

            Panel.panel.update(panel);
        }
    });
    
    // make sure we initialise with the panels from the controller
    view.send({
        type: 'command',
        body: 'GET_PANELS',
    });
}

jQuery(window).ready(init);