goog.provide('Crezy.Remote');

goog.require('goog.object');

Crezy.Remote = function(address) {
    this.address = buildAddress(address || null);
    this.connected = false;
    this._socket = null;
    this.pres = null;
};

Crezy.Remote.rpcMethods = {
    'connect': function() {},
    'disconnect': function() {},
    'getPresentation': function() {},
    'setPresentation': function() {},
    'getStep': function() {},
    'setStep': function() {}
};

function buildAddress(address) {
    if (!address) throw "Address is null";

    if (typeof address == 'string') {
        if (address.split('://').length == 1) address = 'ws://' + address;
        return new URL(address);
    } else if (address instanceof URL) {
        return address;
    }
    return null;
}

Crezy.Remote.prototype.connect = function() {

    this._socket = new WebSocket(this.address);

    // When the connection is open, send some data to the server
    this._socket.onopen = function (evt) {
        console.log('Connected to websocket', evt);
        this.connected = true;
    };

    // Log errors
    this._socket.onerror = function (error) {
        console.log(error);
        throw 'WebSocket Error. Cant connect to remote at: '+this.address;
    };

    // Log messages from the server
    this._socket.onmessage = this.handleMessage;
};

Crezy.Remote.prototype.handleMessage = function (evt) {
    var msg = JSON.parse(evt.data);
    
    switch (msg.id) {
    case 'connect':
        if (msg.connect == true) {
            this.connected = true;
        } else {
            this.connected = false;
        }
        break;
    
    case 'step':
        var step = parseInt(msg.what);

        if (isFinite(step)) {
            Crezy.impress.goto(step);
        } else if (msg.what == 'next') {
            Crezy.impress.next();
        } else if (msg.what == 'prev') {
            Crezy.impress.prev();
        }

        break;

    default: break;
    }
};

Crezy.Remote.prototype.send = function(msgID, msgBody) {
    if (!msgID) throw "msgID is mandatory";
    //goog.object.extend(msg, body);

    this._socket.send(JSON.stringify({
        id: msgID,
        body: msgBody
    }));
}

Crezy.Remote.prototype.bindPresentation = function(presentation) {
    if (!(presentation instanceof Crezy.Presentation)) throw 'Need a Crezy.Presentation as argument';
    
    this.pres = presentation;

    this.send(Crezy.Remote.PRESENTATION, {
        id: this.pres.id,
        slidesCount: this.pres.slidesCount,
    });
}
