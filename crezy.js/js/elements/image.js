goog.provide('Crezy.Image');

goog.require('Crezy.Element');

Crezy.Image = function(args) {
    goog.base(this,args);
}

goog.inherits(Crezy.Image, Crezy.Element);

Crezy.Image.prototype.draw = function() {
    return '<img src="'+this.src+'"/>';
};

available.text = Crezy.Image;
