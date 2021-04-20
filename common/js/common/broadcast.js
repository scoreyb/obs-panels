var Panel = Panel || {};

Panel.Broadcast = function (onmessage) {
    var channel = new BroadcastChannel('panel-comms-channel');

    channel.onmessage = onmessage;

    var send = function (msg) {
        channel.postMessage(msg);
    };

    var close = function () {
        channel.close();
    };

    return {
        send: send,
        close: close,
    };
};