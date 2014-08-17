goog.provide('Crezy.Text');

goog.require('Crezy.Element');

Crezy.Text = function(args) {
    goog.base(this,args);
}
goog.inherits(Crezy.Text, Crezy.Element);

Crezy.Text.prototype.edit = function() {
    this.ui = $('<input type="text" class="element edit" data-type="text" value="'+this.content+'"/>');
    return this.ui;
};

Crezy.Text.prototype.draw = function() {
    this.ui = new createjs.Text(this.content, "40px "+Crezy.presentation.style.font, Crezy.presentation.style.color);
    this.ui.name = this.id;
    
    var box = this.ui.getBounds();
    var hit = new createjs.Shape();
    hit.graphics.beginFill("#000").drawRect(0, 0, box.width, box.height);
    this.ui.hitArea = hit;

    this.ui.regX = box.width / 2;
    this.ui.regY = box.height / 2;
    this.ui.scaleX = this.ui.scaleY = this.scale;
    this.ui.x = this.x;
    this.ui.y = this.y;

    return this.ui;
};

Crezy.Element._available.text = Crezy.Text;
