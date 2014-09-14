goog.provide('Crezy.Image');

goog.require('Crezy.Element');

Crezy.Image = function(args) {
    goog.base(this,args);
    this.src = args.src;
}
goog.inherits(Crezy.Image, Crezy.Element);

Crezy.Image.prototype.draw = function() {
    this.ui = new createjs.Bitmap(Crezy.preload.getResult(this.src));
    this.ui.name = this.id;
    var box = this.ui.getBounds();
    this.ui.regX = box.width / 2;
    this.ui.regY = box.height / 2;
    this.ui.scaleX = (this.w / box.width) * this.scale;
    this.ui.scaleY = (this.h / box.height) * this.scale;
    this.ui.x = this.x;
    this.ui.y = this.y;

    return this.ui;
};

Crezy.Element._available.image = Crezy.Image;
