goog.provide('Crezy.Image');

goog.require('Crezy.Element');

Crezy.Image = function(args) {
    goog.base(this,args);
}
goog.inherits(Crezy.Image, Crezy.Element);

Crezy.Image.prototype.draw = function() {
    this.ui = new createjs.Bitmap('/static/presentations/' + Crezy.presentation.id + '/' + this.content);
    var box = this.ui.getBounds();
    this.ui.regX = box.width / 2;
    this.ui.regY = box.height / 2;
    this.ui.scaleX = this.ui.scaleY = this.scale;
    this.ui.x = this.x;
    this.ui.y = this.y;

    return this.ui;
};

Crezy.Element._available.image = Crezy.Image;
