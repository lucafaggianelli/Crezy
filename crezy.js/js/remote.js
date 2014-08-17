goog.provide('Crezy.Remote');

goog.require('goog.object');

Crezy.Remote = function(address) {
    this.address = buildAddress(address || null);
    this.connected = false;
    Crezy.Remote._socket = null;
    this.pres = null;
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

    Crezy.Remote._socket = new WebSocket(this.address);

    // When the connection is open, send some data to the server
    Crezy.Remote._socket.onopen = function (evt) {
        console.log('Connected to websocket', evt);
        this.connected = true;
    };

    // Log errors
    Crezy.Remote._socket.onerror = function (error) {
        console.log(error);
        throw 'WebSocket Error. Cant connect to remote at: '+this.address;
    };

    // Log messages from the server
    Crezy.Remote._socket.onmessage = this.handleMessage;
};

/*
 * Definition of RPC methods
 */
Crezy.Remote.methods = {
    connect: function() {
        this.connected = true;
    },

    getPresentation: function() {
        return JSON.stringify(Crezy.presentation.json);
    },

    setPresentation: function(pId) {
    
    },

    getStep: function() {
        return Crezy.presentation ? Crezy.presentation.getCurrentStep() : -1;
    },

    setStep: function(step) {
        if (!Crezy.presentation || step == undefined || step == null) return;
        
        var dict = {
            next: Crezy.presentation.getCurrentStep() + 1,
            prev: Crezy.presentation.getCurrentStep() - 1,
            first: 0,
            last: Crezy.presentation.stepsCount-1};

        var stepInt = NaN;
        if (dict.hasOwnProperty(step)) {
            stepInt = dict[step];
            console.log('Step kw:',step,stepInt);
            //if (step < 0) step = 0;
            //else if (step >= Crezy.presentation.stepsCount) step = Crezy.presentation.stepsCount-1;
        } else {
            stepInt = parseInt(step);
            console.log('Parsed int',stepInt);
        }

        if (isFinite(stepInt) && (stepInt>=0) && (stepInt<Crezy.presentation.stepsCount)) {
            Crezy.presentation.setCurrentStep(stepInt);
        } else {
            throw "Step ID not valid: " + step;
        }

        return true;
    },

    present: function(what) {
        if (what == 'play') {
            console.log("Presentation started @ 3s")
            Crezy.presentation.timer = setInterval(function() {
                Crezy.presentation.setCurrentStep(Crezy.presentation.getCurrentStep()+1)
            },3000);
        } else if (what == 'pause') {
            console.log("Presentation paused");
            clearInterval(Crezy.presentation.timer);
        }
    }
};

Crezy.Remote.prototype.handleMessage = function (evt) {
    var msg = JSON.parse(evt.data);

    msg.id = msg.id || 0;

    if (!msg.method)
        throw 'Invalid message, need a method';
    if (!Crezy.Remote.methods.hasOwnProperty(msg.method))
        throw 'Invalid method: '+msg.method;

    var response = Crezy.Remote.methods[msg.method].apply(null,msg.args);

    Crezy.Remote.respond(msg.id, msg.method,response);
};

Crezy.Remote.respond = function(id, method, response) {
    id = id || 0;

    if (!method) throw "Method is required";

    Crezy.Remote._socket.send(JSON.stringify({
        id: id,
        method: method,
        response: response
    }));
};

Crezy.Remote.send = function(id, method, args) {
    id = id || 0;

    if (!method) throw "Method is required";

    Crezy.Remote._socket.send(JSON.stringify({
        id: id,
        method: method,
        args: args
    }));
};

Crezy.Remote.prototype.bindPresentation = function(presentation) {
    if (!(presentation instanceof Crezy.Presentation)) throw 'Need a Crezy.Presentation as argument';
    
    this.pres = presentation;

    this.send(Crezy.Remote.PRESENTATION, {
        id: this.pres.id,
        slidesCount: this.pres.slidesCount,
    });
}
