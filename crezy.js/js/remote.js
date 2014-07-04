goog.provide('Crezy.Remote');

goog.require('goog.object');

Crezy.Remote = function(address) {
    address = address || null;
    if (!address) throw "Need an IP address to connect to!";

    if (typeof address == 'string') {
        if (address.split('://').length == 1) address = 'ws://' + address;
        address = new URL(address);
    }
    else if (!(address instanceof URL)) address = null;

    this.address = address;
    this.connected = false;
    this._socket = null;

    this.pres = null;
};

Crezy.Remote.CONNECT      = 'connect';
Crezy.Remote.PRESENTATION = 'pres';
Crezy.Remote.NOTES        = 'notes';
Crezy.Remote.STEP         = 'step';

Crezy.Remote.prototype.connect = function() {

    this._socket = new WebSocket(this.address);

    // When the connection is open, send some data to the server
    this._socket.onopen = function (evt) {
        console.log('Connected to websocket at: '+this.address);
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
    case CONNECTION:
        if (msg.connect == true) {
            this.connected = true;
        } else {
            this.connected = false;
        }
        break;
    
    case NOTES:
        this.send(NOTES, {});
        break;
    
    case STEP:
        var step = parseInt(msg.what);
        if (msg.verb == 'get') {
            this.send(STEP, {step: 5});
        }

        if (!isFinite(step)) {
            console.log('Expecting an int', msg.what);
            break;
        }

        Crezy.impress.goto(step);
        break;

    default: break;
    }
};


Crezy.Remote.prototype.send = function(msgID, msgBody) {
    if (!msgID) throw "msgID is mandatory";
    //goog.object.extend(msg, body);

    this._socket.send({
        id: msgID,
        body: msgBody
    });
}

Crezy.Remote.prototype.bindPresentation = function(presentation) {
    if (!(presentation instanceof Crezy.Presentation)) throw 'Need a Crezy.Presentation as argument';
    
    this.pres = presentation;

    this.send(Crezy.Remote.PRESENTATION, {
        id: this.pres.id,
        slidesCount: this.pres.slidesCount,
    });
}
