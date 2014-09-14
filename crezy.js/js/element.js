goog.provide('Crezy.Element');

Crezy.Element = function(args) {
    if (!args.id) throw "Need an ID"

    var json = {position: [0,0], size: ['auto','auto'], style: {}, content: '',
        title:null, description:null, animations:[]};
    $.extend(json,args);
    
    this.id = json.id;
    this.type = json.type;
    this.x = json.x;
    this.y = json.y;
    this.w = json.w;
    this.h = json.h;
    this.scale = json.s;
    this.ui = null;
    this.content = json.content;
    this.title = json.title;
    this.description = json.description;
    this.animations = json.animations;
    this.data = json.data;
    this.resource = json.resource;
}

Crezy.Element.prototype.draw = function() {
    if (this.animations.length > 0)
        this.ui.visible = this.animations[0].visible;
}

Crezy.Element.prototype.edit = function() {}

Crezy.Element.newInstance = function(json) {
    if (Crezy.Element._available.hasOwnProperty(json.type) &&
        Crezy.Element._available[json.type] instanceof Function)
    return new Crezy.Element._available[json.type](json);
}

Crezy.Element._available = {};

goog.require('Crezy.Text');
goog.require('Crezy.Image');
goog.require('Crezy.Chart');
