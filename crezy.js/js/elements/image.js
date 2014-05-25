goog.provide('Crezy.Image');

goog.require('Crezy.Element');

Crezy.Image = function(args) {
    goog.base(this,args);
}

goog.inherits(Crezy.Image, Crezy.Element);

Crezy.Image.prototype.draw = function() {
    this.ui = $('<img id="'+this.id+'" class="element" data-type="image" src="'+this.src+'"/>');
    return this.ui;
};

Crezy.Element._available.image = Crezy.Image;
