goog.provide('Crezy.Remote');

Crezy.Remote = function(address) {
    address = address || 'ws://172.30.49.14:8888';
    if (typeof address == 'string') {
        if (address.split('://').length == 1) address = 'ws://' + address;
        address = new URL(address);
    }
    else if (!(address instanceof URL)) address = null;

    this.address = address;
    this.connected = false;
    
    this._socket = null;
};

Crezy.Remote.prototype.connect = function() {

    this._socket = new WebSocket(this.address);

    // When the connection is open, send some data to the server
    this._socket.onopen = function (evt) {
        console.log('Connected to websocket at: '+this.address);
        this.connected = false;
    };

    // Log errors
    this._socket.onerror = function (error) {
        throw 'WebSocket Error. Cant connect to remote at: '+this.address;
    };

    // Log messages from the server
    this._socket.onmessage = function (e) {
        var data = null;
        
        if (typeof data == 'string') {
            try {
                data = JSON.parse(e.data);
            } catch(err) {
                data = e.data;
            }
        } else {
            data = e.data;
        }

        if (data.what) {
            switch (data.what) {
            case 'connection':
                if (data.success === true) {
                    this.connected = true;
                } else {
                    this.connected = false;
                }
                break;
            
            case 'controls':
                for (var i in data.controls) {
                    //applyControl(i,data.controls[i]);
                }
                break;
            
            case 'settings':
                for (var i in data.settings) {
                    //set(i,data.settings[i]);
                }
                break;

            default: break;
            }
        }
    };
};

Crezy.Remote.prototype.bindPresentation = function(presentation) {
    if (!(presentation instanceof Crezy.Presentation)) throw 'Need a Crezy.Presentation as argument';
    
    this._socket.send({
        presentation: presentation.id,
        security: 'abc234',
        slidesCount: 15,
        slidesTimeout: {'1':9,'8':4}});
}
