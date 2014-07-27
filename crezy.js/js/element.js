goog.provide('Crezy.Element');

Crezy.Element = function(args) {
    if (!args.id) throw "Need an ID"

    var json = {position: [0,0], size: ['auto','auto'], style: {}, content: ''};
    $.extend(json,args);
    
    this.id = json.id;
    this.type = json.type;
    this.x = json.x;
    this.y = json.y;
    this.scale = json.s;
    this.ui = null;
    this.content = json.content;
}

Crezy.Element.prototype.draw = function() {}
Crezy.Element.prototype.edit = function() {}

Crezy.Element.newInstance = function(json) {
    if (Crezy.Element._available.hasOwnProperty(json.type) &&
        Crezy.Element._available[json.type] instanceof Function)
    return new Crezy.Element._available[json.type](json);
}

Crezy.Element._available = {};

goog.require('Crezy.Text');
goog.require('Crezy.Image');
